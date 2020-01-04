package com.bol.cs.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.bol.cs.web.rest.TestUtil;

public class ChangeTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Change.class);
        Change change1 = new Change();
        change1.setId(1L);
        Change change2 = new Change();
        change2.setId(change1.getId());
        assertThat(change1).isEqualTo(change2);
        change2.setId(2L);
        assertThat(change1).isNotEqualTo(change2);
        change1.setId(null);
        assertThat(change1).isNotEqualTo(change2);
    }
}
