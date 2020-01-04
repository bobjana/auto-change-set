import { ICommit } from 'app/shared/model/commit.model';
import { IChangeSet } from 'app/shared/model/change-set.model';

export interface IChange {
  id?: number;
  title?: string;
  summary?: string;
  hidden?: boolean;
  authors?: string;
  issueTrackingKey?: string;
  commits?: ICommit[];
  changeSet?: IChangeSet;
}

export class Change implements IChange {
  constructor(
    public id?: number,
    public title?: string,
    public summary?: string,
    public hidden?: boolean,
    public authors?: string,
    public issueTrackingKey?: string,
    public commits?: ICommit[],
    public changeSet?: IChangeSet
  ) {
    this.hidden = this.hidden || false;
  }
}
