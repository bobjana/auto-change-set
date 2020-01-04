package com.bol.cs.repository;

import com.bol.cs.domain.Commit;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Commit entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CommitRepository extends JpaRepository<Commit, Long> {

}
