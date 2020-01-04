import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { AutoChangeSetTestModule } from '../../../test.module';
import { ChangeSetComponent } from 'app/entities/change-set/change-set.component';
import { ChangeSetService } from 'app/entities/change-set/change-set.service';
import { ChangeSet } from 'app/shared/model/change-set.model';

describe('Component Tests', () => {
  describe('ChangeSet Management Component', () => {
    let comp: ChangeSetComponent;
    let fixture: ComponentFixture<ChangeSetComponent>;
    let service: ChangeSetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AutoChangeSetTestModule],
        declarations: [ChangeSetComponent],
        providers: []
      })
        .overrideTemplate(ChangeSetComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ChangeSetComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ChangeSetService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new ChangeSet(123)],
            headers
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.changeSets && comp.changeSets[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
