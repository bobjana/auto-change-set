package com.bol.cs.web.rest;

import com.bol.cs.AutoChangeSetApp;
import com.bol.cs.domain.Commit;
import com.bol.cs.repository.CommitRepository;
import com.bol.cs.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static com.bol.cs.web.rest.TestUtil.sameInstant;
import static com.bol.cs.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link CommitResource} REST controller.
 */
@SpringBootTest(classes = AutoChangeSetApp.class)
public class CommitResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_AUTHOR = "AAAAAAAAAA";
    private static final String UPDATED_AUTHOR = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private CommitRepository commitRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restCommitMockMvc;

    private Commit commit;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CommitResource commitResource = new CommitResource(commitRepository);
        this.restCommitMockMvc = MockMvcBuilders.standaloneSetup(commitResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Commit createEntity(EntityManager em) {
        Commit commit = new Commit()
            .title(DEFAULT_TITLE)
            .author(DEFAULT_AUTHOR)
            .date(DEFAULT_DATE);
        return commit;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Commit createUpdatedEntity(EntityManager em) {
        Commit commit = new Commit()
            .title(UPDATED_TITLE)
            .author(UPDATED_AUTHOR)
            .date(UPDATED_DATE);
        return commit;
    }

    @BeforeEach
    public void initTest() {
        commit = createEntity(em);
    }

    @Test
    @Transactional
    public void createCommit() throws Exception {
        int databaseSizeBeforeCreate = commitRepository.findAll().size();

        // Create the Commit
        restCommitMockMvc.perform(post("/api/commits")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(commit)))
            .andExpect(status().isCreated());

        // Validate the Commit in the database
        List<Commit> commitList = commitRepository.findAll();
        assertThat(commitList).hasSize(databaseSizeBeforeCreate + 1);
        Commit testCommit = commitList.get(commitList.size() - 1);
        assertThat(testCommit.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testCommit.getAuthor()).isEqualTo(DEFAULT_AUTHOR);
        assertThat(testCommit.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    public void createCommitWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = commitRepository.findAll().size();

        // Create the Commit with an existing ID
        commit.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCommitMockMvc.perform(post("/api/commits")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(commit)))
            .andExpect(status().isBadRequest());

        // Validate the Commit in the database
        List<Commit> commitList = commitRepository.findAll();
        assertThat(commitList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllCommits() throws Exception {
        // Initialize the database
        commitRepository.saveAndFlush(commit);

        // Get all the commitList
        restCommitMockMvc.perform(get("/api/commits?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(commit.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))));
    }
    
    @Test
    @Transactional
    public void getCommit() throws Exception {
        // Initialize the database
        commitRepository.saveAndFlush(commit);

        // Get the commit
        restCommitMockMvc.perform(get("/api/commits/{id}", commit.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(commit.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.author").value(DEFAULT_AUTHOR))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)));
    }

    @Test
    @Transactional
    public void getNonExistingCommit() throws Exception {
        // Get the commit
        restCommitMockMvc.perform(get("/api/commits/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCommit() throws Exception {
        // Initialize the database
        commitRepository.saveAndFlush(commit);

        int databaseSizeBeforeUpdate = commitRepository.findAll().size();

        // Update the commit
        Commit updatedCommit = commitRepository.findById(commit.getId()).get();
        // Disconnect from session so that the updates on updatedCommit are not directly saved in db
        em.detach(updatedCommit);
        updatedCommit
            .title(UPDATED_TITLE)
            .author(UPDATED_AUTHOR)
            .date(UPDATED_DATE);

        restCommitMockMvc.perform(put("/api/commits")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCommit)))
            .andExpect(status().isOk());

        // Validate the Commit in the database
        List<Commit> commitList = commitRepository.findAll();
        assertThat(commitList).hasSize(databaseSizeBeforeUpdate);
        Commit testCommit = commitList.get(commitList.size() - 1);
        assertThat(testCommit.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testCommit.getAuthor()).isEqualTo(UPDATED_AUTHOR);
        assertThat(testCommit.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingCommit() throws Exception {
        int databaseSizeBeforeUpdate = commitRepository.findAll().size();

        // Create the Commit

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCommitMockMvc.perform(put("/api/commits")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(commit)))
            .andExpect(status().isBadRequest());

        // Validate the Commit in the database
        List<Commit> commitList = commitRepository.findAll();
        assertThat(commitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteCommit() throws Exception {
        // Initialize the database
        commitRepository.saveAndFlush(commit);

        int databaseSizeBeforeDelete = commitRepository.findAll().size();

        // Delete the commit
        restCommitMockMvc.perform(delete("/api/commits/{id}", commit.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Commit> commitList = commitRepository.findAll();
        assertThat(commitList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
