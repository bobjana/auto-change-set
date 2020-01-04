import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AutoChangeSetTestModule } from '../../../test.module';
import { ChangeDetailComponent } from 'app/entities/change/change-detail.component';
import { Change } from 'app/shared/model/change.model';

describe('Component Tests', () => {
  describe('Change Management Detail Component', () => {
    let comp: ChangeDetailComponent;
    let fixture: ComponentFixture<ChangeDetailComponent>;
    const route = ({ data: of({ change: new Change(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AutoChangeSetTestModule],
        declarations: [ChangeDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(ChangeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ChangeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load change on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.change).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
