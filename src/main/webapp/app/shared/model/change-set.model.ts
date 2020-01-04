import { Moment } from 'moment';
import { IChange } from 'app/shared/model/change.model';

export interface IChangeSet {
  id?: number;
  title?: string;
  summary?: string;
  released?: boolean;
  date?: Moment;
  changes?: IChange[];
}

export class ChangeSet implements IChangeSet {
  constructor(
    public id?: number,
    public title?: string,
    public summary?: string,
    public released?: boolean,
    public date?: Moment,
    public changes?: IChange[]
  ) {
    this.released = this.released || false;
  }
}
