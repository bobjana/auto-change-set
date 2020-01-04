package com.bol.cs.domain;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * A ChangeSet.
 */
@Entity
@Table(name = "change_set")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class ChangeSet implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "summary")
    private String summary;

    @Column(name = "released")
    private Boolean released;

    @Column(name = "date")
    private ZonedDateTime date;

    @OneToMany(mappedBy = "changeSet")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Change> changes = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public ChangeSet title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return summary;
    }

    public ChangeSet summary(String summary) {
        this.summary = summary;
        return this;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Boolean isReleased() {
        return released;
    }

    public ChangeSet released(Boolean released) {
        this.released = released;
        return this;
    }

    public void setReleased(Boolean released) {
        this.released = released;
    }

    public ZonedDateTime getDate() {
        return date;
    }

    public ChangeSet date(ZonedDateTime date) {
        this.date = date;
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public Set<Change> getChanges() {
        return changes;
    }

    public ChangeSet changes(Set<Change> changes) {
        this.changes = changes;
        return this;
    }

    public ChangeSet addChange(Change change) {
        this.changes.add(change);
        change.setChangeSet(this);
        return this;
    }

    public ChangeSet removeChange(Change change) {
        this.changes.remove(change);
        change.setChangeSet(null);
        return this;
    }

    public void setChanges(Set<Change> changes) {
        this.changes = changes;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ChangeSet)) {
            return false;
        }
        return id != null && id.equals(((ChangeSet) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "ChangeSet{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", summary='" + getSummary() + "'" +
            ", released='" + isReleased() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
