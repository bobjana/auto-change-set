import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { AutoChangeSetTestModule } from '../../../test.module';
import { CommitComponent } from 'app/entities/commit/commit.component';
import { CommitService } from 'app/entities/commit/commit.service';
import { Commit } from 'app/shared/model/commit.model';

describe('Component Tests', () => {
  describe('Commit Management Component', () => {
    let comp: CommitComponent;
    let fixture: ComponentFixture<CommitComponent>;
    let service: CommitService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AutoChangeSetTestModule],
        declarations: [CommitComponent],
        providers: []
      })
        .overrideTemplate(CommitComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CommitComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CommitService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Commit(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.commits && comp.commits[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
