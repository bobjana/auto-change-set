import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { ICommit } from 'app/shared/model/commit.model';

type EntityResponseType = HttpResponse<ICommit>;
type EntityArrayResponseType = HttpResponse<ICommit[]>;

@Injectable({ providedIn: 'root' })
export class CommitService {
  public resourceUrl = SERVER_API_URL + 'api/commits';

  constructor(protected http: HttpClient) {}

  create(commit: ICommit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(commit);
    return this.http
      .post<ICommit>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(commit: ICommit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(commit);
    return this.http
      .put<ICommit>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICommit>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICommit[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(commit: ICommit): ICommit {
    const copy: ICommit = Object.assign({}, commit, {
      date: commit.date && commit.date.isValid() ? commit.date.toJSON() : undefined
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
      res.body.forEach((commit: ICommit) => {
        commit.date = commit.date ? moment(commit.date) : undefined;
      });
    }
    return res;
  }
}
