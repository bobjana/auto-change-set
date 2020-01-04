package com.bol.cs.web.rest;

import com.bol.cs.AutoChangeSetApp;
import com.bol.cs.domain.Change;
import com.bol.cs.repository.ChangeRepository;
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
import java.util.List;

import static com.bol.cs.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link ChangeResource} REST controller.
 */
@SpringBootTest(classes = AutoChangeSetApp.class)
public class ChangeResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final String DEFAULT_SUMMARY = "AAAAAAAAAA";
    private static final String UPDATED_SUMMARY = "BBBBBBBBBB";

    private static final Boolean DEFAULT_HIDDEN = false;
    private static final Boolean UPDATED_HIDDEN = true;

    private static final String DEFAULT_AUTHORS = "AAAAAAAAAA";
    private static final String UPDATED_AUTHORS = "BBBBBBBBBB";

    private static final String DEFAULT_ISSUE_TRACKING_KEY = "AAAAAAAAAA";
    private static final String UPDATED_ISSUE_TRACKING_KEY = "BBBBBBBBBB";

    @Autowired
    private ChangeRepository changeRepository;

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

    private MockMvc restChangeMockMvc;

    private Change change;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ChangeResource changeResource = new ChangeResource(changeRepository);
        this.restChangeMockMvc = MockMvcBuilders.standaloneSetup(changeResource)
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
    public static Change createEntity(EntityManager em) {
        Change change = new Change()
            .title(DEFAULT_TITLE)
            .summary(DEFAULT_SUMMARY)
            .hidden(DEFAULT_HIDDEN)
            .authors(DEFAULT_AUTHORS)
            .issueTrackingKey(DEFAULT_ISSUE_TRACKING_KEY);
        return change;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Change createUpdatedEntity(EntityManager em) {
        Change change = new Change()
            .title(UPDATED_TITLE)
            .summary(UPDATED_SUMMARY)
            .hidden(UPDATED_HIDDEN)
            .authors(UPDATED_AUTHORS)
            .issueTrackingKey(UPDATED_ISSUE_TRACKING_KEY);
        return change;
    }

    @BeforeEach
    public void initTest() {
        change = createEntity(em);
    }

    @Test
    @Transactional
    public void createChange() throws Exception {
        int databaseSizeBeforeCreate = changeRepository.findAll().size();

        // Create the Change
        restChangeMockMvc.perform(post("/api/changes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(change)))
            .andExpect(status().isCreated());

        // Validate the Change in the database
        List<Change> changeList = changeRepository.findAll();
        assertThat(changeList).hasSize(databaseSizeBeforeCreate + 1);
        Change testChange = changeList.get(changeList.size() - 1);
        assertThat(testChange.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testChange.getSummary()).isEqualTo(DEFAULT_SUMMARY);
        assertThat(testChange.isHidden()).isEqualTo(DEFAULT_HIDDEN);
        assertThat(testChange.getAuthors()).isEqualTo(DEFAULT_AUTHORS);
        assertThat(testChange.getIssueTrackingKey()).isEqualTo(DEFAULT_ISSUE_TRACKING_KEY);
    }

    @Test
    @Transactional
    public void createChangeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = changeRepository.findAll().size();

        // Create the Change with an existing ID
        change.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restChangeMockMvc.perform(post("/api/changes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(change)))
            .andExpect(status().isBadRequest());

        // Validate the Change in the database
        List<Change> changeList = changeRepository.findAll();
        assertThat(changeList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllChanges() throws Exception {
        // Initialize the database
        changeRepository.saveAndFlush(change);

        // Get all the changeList
        restChangeMockMvc.perform(get("/api/changes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(change.getId().intValue())))
            .andExpect(jsonPath("$.[*].title").value(hasItem(DEFAULT_TITLE)))
            .andExpect(jsonPath("$.[*].summary").value(hasItem(DEFAULT_SUMMARY)))
            .andExpect(jsonPath("$.[*].hidden").value(hasItem(DEFAULT_HIDDEN.booleanValue())))
            .andExpect(jsonPath("$.[*].authors").value(hasItem(DEFAULT_AUTHORS)))
            .andExpect(jsonPath("$.[*].issueTrackingKey").value(hasItem(DEFAULT_ISSUE_TRACKING_KEY)));
    }
    
    @Test
    @Transactional
    public void getChange() throws Exception {
        // Initialize the database
        changeRepository.saveAndFlush(change);

        // Get the change
        restChangeMockMvc.perform(get("/api/changes/{id}", change.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(change.getId().intValue()))
            .andExpect(jsonPath("$.title").value(DEFAULT_TITLE))
            .andExpect(jsonPath("$.summary").value(DEFAULT_SUMMARY))
            .andExpect(jsonPath("$.hidden").value(DEFAULT_HIDDEN.booleanValue()))
            .andExpect(jsonPath("$.authors").value(DEFAULT_AUTHORS))
            .andExpect(jsonPath("$.issueTrackingKey").value(DEFAULT_ISSUE_TRACKING_KEY));
    }

    @Test
    @Transactional
    public void getNonExistingChange() throws Exception {
        // Get the change
        restChangeMockMvc.perform(get("/api/changes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateChange() throws Exception {
        // Initialize the database
        changeRepository.saveAndFlush(change);

        int databaseSizeBeforeUpdate = changeRepository.findAll().size();

        // Update the change
        Change updatedChange = changeRepository.findById(change.getId()).get();
        // Disconnect from session so that the updates on updatedChange are not directly saved in db
        em.detach(updatedChange);
        updatedChange
            .title(UPDATED_TITLE)
            .summary(UPDATED_SUMMARY)
            .hidden(UPDATED_HIDDEN)
            .authors(UPDATED_AUTHORS)
            .issueTrackingKey(UPDATED_ISSUE_TRACKING_KEY);

        restChangeMockMvc.perform(put("/api/changes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedChange)))
            .andExpect(status().isOk());

        // Validate the Change in the database
        List<Change> changeList = changeRepository.findAll();
        assertThat(changeList).hasSize(databaseSizeBeforeUpdate);
        Change testChange = changeList.get(changeList.size() - 1);
        assertThat(testChange.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testChange.getSummary()).isEqualTo(UPDATED_SUMMARY);
        assertThat(testChange.isHidden()).isEqualTo(UPDATED_HIDDEN);
        assertThat(testChange.getAuthors()).isEqualTo(UPDATED_AUTHORS);
        assertThat(testChange.getIssueTrackingKey()).isEqualTo(UPDATED_ISSUE_TRACKING_KEY);
    }

    @Test
    @Transactional
    public void updateNonExistingChange() throws Exception {
        int databaseSizeBeforeUpdate = changeRepository.findAll().size();

        // Create the Change

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChangeMockMvc.perform(put("/api/changes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(change)))
            .andExpect(status().isBadRequest());

        // Validate the Change in the database
        List<Change> changeList = changeRepository.findAll();
        assertThat(changeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteChange() throws Exception {
        // Initialize the database
        changeRepository.saveAndFlush(change);

        int databaseSizeBeforeDelete = changeRepository.findAll().size();

        // Delete the change
        restChangeMockMvc.perform(delete("/api/changes/{id}", change.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Change> changeList = changeRepository.findAll();
        assertThat(changeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
