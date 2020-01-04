package com.bol.cs.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.bol.cs.web.rest.TestUtil;

public class ChangeSetTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ChangeSet.class);
        ChangeSet changeSet1 = new ChangeSet();
        changeSet1.setId(1L);
        ChangeSet changeSet2 = new ChangeSet();
        changeSet2.setId(changeSet1.getId());
        assertThat(changeSet1).isEqualTo(changeSet2);
        changeSet2.setId(2L);
        assertThat(changeSet1).isNotEqualTo(changeSet2);
        changeSet1.setId(null);
        assertThat(changeSet1).isNotEqualTo(changeSet2);
    }
}
