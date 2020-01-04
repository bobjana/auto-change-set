import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AutoChangeSetTestModule } from '../../../test.module';
import { ChangeSetDetailComponent } from 'app/entities/change-set/change-set-detail.component';
import { ChangeSet } from 'app/shared/model/change-set.model';

describe('Component Tests', () => {
  describe('ChangeSet Management Detail Component', () => {
    let comp: ChangeSetDetailComponent;
    let fixture: ComponentFixture<ChangeSetDetailComponent>;
    const route = ({ data: of({ changeSet: new ChangeSet(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AutoChangeSetTestModule],
        declarations: [ChangeSetDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(ChangeSetDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ChangeSetDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load changeSet on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.changeSet).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
