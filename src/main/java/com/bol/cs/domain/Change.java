package com.bol.cs.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Change.
 */
@Entity
@Table(name = "change")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Change implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "summary")
    private String summary;

    @Column(name = "hidden")
    private Boolean hidden;

    @Column(name = "authors")
    private String authors;

    @Column(name = "issue_tracking_key")
    private String issueTrackingKey;

    @OneToMany(mappedBy = "change")
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Commit> commits = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties("changes")
    private ChangeSet changeSet;

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

    public Change title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return summary;
    }

    public Change summary(String summary) {
        this.summary = summary;
        return this;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Boolean isHidden() {
        return hidden;
    }

    public Change hidden(Boolean hidden) {
        this.hidden = hidden;
        return this;
    }

    public void setHidden(Boolean hidden) {
        this.hidden = hidden;
    }

    public String getAuthors() {
        return authors;
    }

    public Change authors(String authors) {
        this.authors = authors;
        return this;
    }

    public void setAuthors(String authors) {
        this.authors = authors;
    }

    public String getIssueTrackingKey() {
        return issueTrackingKey;
    }

    public Change issueTrackingKey(String issueTrackingKey) {
        this.issueTrackingKey = issueTrackingKey;
        return this;
    }

    public void setIssueTrackingKey(String issueTrackingKey) {
        this.issueTrackingKey = issueTrackingKey;
    }

    public Set<Commit> getCommits() {
        return commits;
    }

    public Change commits(Set<Commit> commits) {
        this.commits = commits;
        return this;
    }

    public Change addCommit(Commit commit) {
        this.commits.add(commit);
        commit.setChange(this);
        return this;
    }

    public Change removeCommit(Commit commit) {
        this.commits.remove(commit);
        commit.setChange(null);
        return this;
    }

    public void setCommits(Set<Commit> commits) {
        this.commits = commits;
    }

    public ChangeSet getChangeSet() {
        return changeSet;
    }

    public Change changeSet(ChangeSet changeSet) {
        this.changeSet = changeSet;
        return this;
    }

    public void setChangeSet(ChangeSet changeSet) {
        this.changeSet = changeSet;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Change)) {
            return false;
        }
        return id != null && id.equals(((Change) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Change{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", summary='" + getSummary() + "'" +
            ", hidden='" + isHidden() + "'" +
            ", authors='" + getAuthors() + "'" +
            ", issueTrackingKey='" + getIssueTrackingKey() + "'" +
            "}";
    }
}
