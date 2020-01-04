import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IChangeSet } from 'app/shared/model/change-set.model';

type EntityResponseType = HttpResponse<IChangeSet>;
type EntityArrayResponseType = HttpResponse<IChangeSet[]>;

@Injectable({ providedIn: 'root' })
export class ChangeSetService {
  public resourceUrl = SERVER_API_URL + 'api/change-sets';

  constructor(protected http: HttpClient) {}

  create(changeSet: IChangeSet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(changeSet);
    return this.http
      .post<IChangeSet>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(changeSet: IChangeSet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(changeSet);
    return this.http
      .put<IChangeSet>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IChangeSet>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IChangeSet[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(changeSet: IChangeSet): IChangeSet {
    const copy: IChangeSet = Object.assign({}, changeSet, {
      date: changeSet.date && changeSet.date.isValid() ? changeSet.date.toJSON() : undefined
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? moment(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((changeSet: IChangeSet) => {
        changeSet.date = changeSet.date ? moment(changeSet.date) : undefined;
      });
    }
    return res;
  }
}
