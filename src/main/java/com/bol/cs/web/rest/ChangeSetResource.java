package com.bol.cs.web.rest;

import com.bol.cs.domain.ChangeSet;
import com.bol.cs.repository.ChangeSetRepository;
import com.bol.cs.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional; 
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.bol.cs.domain.ChangeSet}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ChangeSetResource {

    private final Logger log = LoggerFactory.getLogger(ChangeSetResource.class);

    private static final String ENTITY_NAME = "changeSet";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChangeSetRepository changeSetRepository;

    public ChangeSetResource(ChangeSetRepository changeSetRepository) {
        this.changeSetRepository = changeSetRepository;
    }

    /**
     * {@code POST  /change-sets} : Create a new changeSet.
     *
     * @param changeSet the changeSet to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new changeSet, or with status {@code 400 (Bad Request)} if the changeSet has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/change-sets")
    public ResponseEntity<ChangeSet> createChangeSet(@Valid @RequestBody ChangeSet changeSet) throws URISyntaxException {
        log.debug("REST request to save ChangeSet : {}", changeSet);
        if (changeSet.getId() != null) {
            throw new BadRequestAlertException("A new changeSet cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ChangeSet result = changeSetRepository.save(changeSet);
        return ResponseEntity.created(new URI("/api/change-sets/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /change-sets} : Updates an existing changeSet.
     *
     * @param changeSet the changeSet to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated changeSet,
     * or with status {@code 400 (Bad Request)} if the changeSet is not valid,
     * or with status {@code 500 (Internal Server Error)} if the changeSet couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/change-sets")
    public ResponseEntity<ChangeSet> updateChangeSet(@Valid @RequestBody ChangeSet changeSet) throws URISyntaxException {
        log.debug("REST request to update ChangeSet : {}", changeSet);
        if (changeSet.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ChangeSet result = changeSetRepository.save(changeSet);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, changeSet.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /change-sets} : get all the changeSets.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of changeSets in body.
     */
    @GetMapping("/change-sets")
    public List<ChangeSet> getAllChangeSets() {
        log.debug("REST request to get all ChangeSets");
        return changeSetRepository.findAll();
    }

    /**
     * {@code GET  /change-sets/:id} : get the "id" changeSet.
     *
     * @param id the id of the changeSet to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the changeSet, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/change-sets/{id}")
    public ResponseEntity<ChangeSet> getChangeSet(@PathVariable Long id) {
        log.debug("REST request to get ChangeSet : {}", id);
        Optional<ChangeSet> changeSet = changeSetRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(changeSet);
    }

    /**
     * {@code DELETE  /change-sets/:id} : delete the "id" changeSet.
     *
     * @param id the id of the changeSet to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/change-sets/{id}")
    public ResponseEntity<Void> deleteChangeSet(@PathVariable Long id) {
        log.debug("REST request to delete ChangeSet : {}", id);
        changeSetRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
