import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AutoChangeSetTestModule } from '../../../test.module';
import { CommitDetailComponent } from 'app/entities/commit/commit-detail.component';
import { Commit } from 'app/shared/model/commit.model';

describe('Component Tests', () => {
  describe('Commit Management Detail Component', () => {
    let comp: CommitDetailComponent;
    let fixture: ComponentFixture<CommitDetailComponent>;
    const route = ({ data: of({ commit: new Commit(123) }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AutoChangeSetTestModule],
        declarations: [CommitDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }]
      })
        .overrideTemplate(CommitDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CommitDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load commit on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.commit).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
