package com.bol.cs.web.rest;

import com.bol.cs.domain.Commit;
import com.bol.cs.repository.CommitRepository;
import com.bol.cs.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional; 
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.bol.cs.domain.Commit}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CommitResource {

    private final Logger log = LoggerFactory.getLogger(CommitResource.class);

    private static final String ENTITY_NAME = "commit";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CommitRepository commitRepository;

    public CommitResource(CommitRepository commitRepository) {
        this.commitRepository = commitRepository;
    }

    /**
     * {@code POST  /commits} : Create a new commit.
     *
     * @param commit the commit to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new commit, or with status {@code 400 (Bad Request)} if the commit has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/commits")
    public ResponseEntity<Commit> createCommit(@RequestBody Commit commit) throws URISyntaxException {
        log.debug("REST request to save Commit : {}", commit);
        if (commit.getId() != null) {
            throw new BadRequestAlertException("A new commit cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Commit result = commitRepository.save(commit);
        return ResponseEntity.created(new URI("/api/commits/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /commits} : Updates an existing commit.
     *
     * @param commit the commit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated commit,
     * or with status {@code 400 (Bad Request)} if the commit is not valid,
     * or with status {@code 500 (Internal Server Error)} if the commit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/commits")
    public ResponseEntity<Commit> updateCommit(@RequestBody Commit commit) throws URISyntaxException {
        log.debug("REST request to update Commit : {}", commit);
        if (commit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Commit result = commitRepository.save(commit);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, commit.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /commits} : get all the commits.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of commits in body.
     */
    @GetMapping("/commits")
    public List<Commit> getAllCommits() {
        log.debug("REST request to get all Commits");
        return commitRepository.findAll();
    }

    /**
     * {@code GET  /commits/:id} : get the "id" commit.
     *
     * @param id the id of the commit to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the commit, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/commits/{id}")
    public ResponseEntity<Commit> getCommit(@PathVariable Long id) {
        log.debug("REST request to get Commit : {}", id);
        Optional<Commit> commit = commitRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(commit);
    }

    /**
     * {@code DELETE  /commits/:id} : delete the "id" commit.
     *
     * @param id the id of the commit to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/commits/{id}")
    public ResponseEntity<Void> deleteCommit(@PathVariable Long id) {
        log.debug("REST request to delete Commit : {}", id);
        commitRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
