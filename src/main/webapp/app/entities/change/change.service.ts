import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IChange } from 'app/shared/model/change.model';

type EntityResponseType = HttpResponse<IChange>;
type EntityArrayResponseType = HttpResponse<IChange[]>;

@Injectable({ providedIn: 'root' })
export class ChangeService {
  public resourceUrl = SERVER_API_URL + 'api/changes';

  constructor(protected http: HttpClient) {}

  create(change: IChange): Observable<EntityResponseType> {
    return this.http.post<IChange>(this.resourceUrl, change, { observe: 'response' });
  }

  update(change: IChange): Observable<EntityResponseType> {
    return this.http.put<IChange>(this.resourceUrl, change, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IChange>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChange[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
