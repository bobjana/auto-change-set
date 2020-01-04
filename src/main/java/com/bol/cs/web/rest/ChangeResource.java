package com.bol.cs.web.rest;

import com.bol.cs.domain.Change;
import com.bol.cs.repository.ChangeRepository;
import com.bol.cs.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional; 
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.bol.cs.domain.Change}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ChangeResource {

    private final Logger log = LoggerFactory.getLogger(ChangeResource.class);

    private static final String ENTITY_NAME = "change";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ChangeRepository changeRepository;

    public ChangeResource(ChangeRepository changeRepository) {
        this.changeRepository = changeRepository;
    }

    /**
     * {@code POST  /changes} : Create a new change.
     *
     * @param change the change to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new change, or with status {@code 400 (Bad Request)} if the change has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/changes")
    public ResponseEntity<Change> createChange(@RequestBody Change change) throws URISyntaxException {
        log.debug("REST request to save Change : {}", change);
        if (change.getId() != null) {
            throw new BadRequestAlertException("A new change cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Change result = changeRepository.save(change);
        return ResponseEntity.created(new URI("/api/changes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /changes} : Updates an existing change.
     *
     * @param change the change to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated change,
     * or with status {@code 400 (Bad Request)} if the change is not valid,
     * or with status {@code 500 (Internal Server Error)} if the change couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/changes")
    public ResponseEntity<Change> updateChange(@RequestBody Change change) throws URISyntaxException {
        log.debug("REST request to update Change : {}", change);
        if (change.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Change result = changeRepository.save(change);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, change.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /changes} : get all the changes.
     *

     * @param pageable the pagination information.

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of changes in body.
     */
    @GetMapping("/changes")
    public ResponseEntity<List<Change>> getAllChanges(Pageable pageable) {
        log.debug("REST request to get a page of Changes");
        Page<Change> page = changeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /changes/:id} : get the "id" change.
     *
     * @param id the id of the change to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the change, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/changes/{id}")
    public ResponseEntity<Change> getChange(@PathVariable Long id) {
        log.debug("REST request to get Change : {}", id);
        Optional<Change> change = changeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(change);
    }

    /**
     * {@code DELETE  /changes/:id} : delete the "id" change.
     *
     * @param id the id of the change to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/changes/{id}")
    public ResponseEntity<Void> deleteChange(@PathVariable Long id) {
        log.debug("REST request to delete Change : {}", id);
        changeRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
