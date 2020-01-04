package com.bol.cs.repository;

import com.bol.cs.domain.ChangeSet;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ChangeSet entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChangeSetRepository extends JpaRepository<ChangeSet, Long> {

}
