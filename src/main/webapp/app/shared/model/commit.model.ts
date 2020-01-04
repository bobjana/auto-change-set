import { Moment } from 'moment';
import { IChange } from 'app/shared/model/change.model';

export interface ICommit {
  id?: number;
  title?: string;
  author?: string;
  date?: Moment;
  change?: IChange;
}

export class Commit implements ICommit {
  constructor(public id?: number, public title?: string, public author?: string, public date?: Moment, public change?: IChange) {}
}
