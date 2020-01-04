package com.bol.cs.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.bol.cs.web.rest.TestUtil;

public class CommitTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Commit.class);
        Commit commit1 = new Commit();
        commit1.setId(1L);
        Commit commit2 = new Commit();
        commit2.setId(commit1.getId());
        assertThat(commit1).isEqualTo(commit2);
        commit2.setId(2L);
        assertThat(commit1).isNotEqualTo(commit2);
        commit1.setId(null);
        assertThat(commit1).isNotEqualTo(commit2);
    }
}
