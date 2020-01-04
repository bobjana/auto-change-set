package com.bol.cs.web.rest;

import com.bol.cs.AutoChangeSetApp;
import com.bol.cs.domain.ChangeSet;
import com.bol.cs.repository.ChangeSetRepository;
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
 * Integration tests for the {@link ChangeSetResource} REST controller.
 */
@SpringBootTest(classes = AutoChangeSetApp.class)
public class ChangeSetResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_SUMMARY = "AAAAAAAAAA";
    private static final String UPDATED_SUMMARY = "BBBBBBBBBB";

    private static final Boolean DEFAULT_RELEASED = false;
    private static final Boolean UPDATED_RELEASED = true;

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private ChangeSetRepository changeSetRepository;

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

    private MockMvc restChangeSetMockMvc;

    private ChangeSet changeSet;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ChangeSetResource changeSetResource = new ChangeSetResource(changeSetRepository);
        this.restChangeSetMockMvc = MockMvcBuilders.standaloneSetup(changeSetResource)
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
    public static ChangeSet createEntity(EntityManager em) {
        ChangeSet changeSet = new ChangeSet()
            .title(DEFAULT_TITLE)
            .summary(DEFAULT_SUMMARY)
            .released(DEFAULT_RELEASED)
            .date(DEFAULT_DATE);
        return changeSet;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChangeSet createUpdatedEntity(EntityManager em) {
        ChangeSet changeSet = new ChangeSet()
            .title(UPDATED_TITLE)
            .summary(UPDATED_SUMMARY)
            .released(UPDATED_RELEASED)
            .date(UPDATED_DATE);
        return changeSet;
    }

    @BeforeEach
    public void initTest() {
        changeSet = createEntity(em);
    }

    @Test
    @Transactional
    public void createChangeSet() throws Exception {
        int databaseSizeBeforeCreate = changeSetRepository.findAll().size();

        // Create the ChangeSet
        restChangeSetMockMvc.perform(post("/api/change-sets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(changeSet)))
            .andExpect(status().isCreated());

        // Validate the ChangeSet in the database
        List<ChangeSet> changeSetList = changeSetRepository.findAll();
        assertThat(changeSetList).hasSize(databaseSizeBeforeCreate + 1);
        ChangeSet testChangeSet = changeSetList.get(changeSetList.size() - 1);
        assertThat(testChangeSet.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testChangeSet.getSummary()).isEqualTo(DEFAULT_SUMMARY);
        assertThat(testChangeSet.isReleased()).isEqualTo(DEFAULT_RELEASED);
        assertThat(testChangeSet.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    public void createChangeSetWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = changeSetRepository.findAll().size();

        // Create the ChangeSet with an existing ID
        changeSet.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restChangeSetMockMvc.perform(post("/api/change-sets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(changeSet)))
            .andExpect(status().isBadRequest());

        // Validate the ChangeSet in the database
        List<ChangeSet> changeSetList = changeSetRepository.findAll();
        assertThat(changeSetList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = changeSetRepository.findAll().size();
        // set the field null
        changeSet.setTitle(null);

        // Create the ChangeSet, which fails.

        restChangeSetMockMvc.perform(post("/api/change-sets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(changeSet)))
            .andExpect(status().isBadRequest());

        List<ChangeSet> changeSetList = changeSetRepository.findAll();
        assertThat(changeSetList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllChangeSets() throws Exception {
        // Initialize the database
        changeSetRepository.saveAndFlush(changeSet);

        // Get all the changeSetList
        restChangeSetMockMvc.perform(get("/api/change-sets?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(changeSet.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].summary").value(hasItem(DEFAULT_SUMMARY)))
            .andExpect(jsonPath("$.[*].released").value(hasItem(DEFAULT_RELEASED.booleanValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))));
    }
    
    @Test
    @Transactional
    public void getChangeSet() throws Exception {
        // Initialize the database
        changeSetRepository.saveAndFlush(changeSet);

        // Get the changeSet
        restChangeSetMockMvc.perform(get("/api/change-sets/{id}", changeSet.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(changeSet.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.summary").value(DEFAULT_SUMMARY))
            .andExpect(jsonPath("$.released").value(DEFAULT_RELEASED.booleanValue()))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)));
    }

    @Test
    @Transactional
    public void getNonExistingChangeSet() throws Exception {
        // Get the changeSet
        restChangeSetMockMvc.perform(get("/api/change-sets/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateChangeSet() throws Exception {
        // Initialize the database
        changeSetRepository.saveAndFlush(changeSet);

        int databaseSizeBeforeUpdate = changeSetRepository.findAll().size();

        // Update the changeSet
        ChangeSet updatedChangeSet = changeSetRepository.findById(changeSet.getId()).get();
        // Disconnect from session so that the updates on updatedChangeSet are not directly saved in db
        em.detach(updatedChangeSet);
        updatedChangeSet
            .title(UPDATED_TITLE)
            .summary(UPDATED_SUMMARY)
            .released(UPDATED_RELEASED)
            .date(UPDATED_DATE);

        restChangeSetMockMvc.perform(put("/api/change-sets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedChangeSet)))
            .andExpect(status().isOk());

        // Validate the ChangeSet in the database
        List<ChangeSet> changeSetList = changeSetRepository.findAll();
        assertThat(changeSetList).hasSize(databaseSizeBeforeUpdate);
        ChangeSet testChangeSet = changeSetList.get(changeSetList.size() - 1);
        assertThat(testChangeSet.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testChangeSet.getSummary()).isEqualTo(UPDATED_SUMMARY);
        assertThat(testChangeSet.isReleased()).isEqualTo(UPDATED_RELEASED);
        assertThat(testChangeSet.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingChangeSet() throws Exception {
        int databaseSizeBeforeUpdate = changeSetRepository.findAll().size();

        // Create the ChangeSet

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChangeSetMockMvc.perform(put("/api/change-sets")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(changeSet)))
            .andExpect(status().isBadRequest());

        // Validate the ChangeSet in the database
        List<ChangeSet> changeSetList = changeSetRepository.findAll();
        assertThat(changeSetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteChangeSet() throws Exception {
        // Initialize the database
        changeSetRepository.saveAndFlush(changeSet);

        int databaseSizeBeforeDelete = changeSetRepository.findAll().size();

        // Delete the changeSet
        restChangeSetMockMvc.perform(delete("/api/change-sets/{id}", changeSet.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ChangeSet> changeSetList = changeSetRepository.findAll();
        assertThat(changeSetList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
