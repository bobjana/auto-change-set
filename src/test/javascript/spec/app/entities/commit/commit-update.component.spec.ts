import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { AutoChangeSetTestModule } from '../../../test.module';
import { CommitUpdateComponent } from 'app/entities/commit/commit-update.component';
import { CommitService } from 'app/entities/commit/commit.service';
import { Commit } from 'app/shared/model/commit.model';

describe('Component Tests', () => {
  describe('Commit Management Update Component', () => {
    let comp: CommitUpdateComponent;
    let fixture: ComponentFixture<CommitUpdateComponent>;
    let service: CommitService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AutoChangeSetTestModule],
        declarations: [CommitUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(CommitUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CommitUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(CommitService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Commit(123);
        spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.update).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));

      it('Should call create service on save for new entity', fakeAsync(() => {
        // GIVEN
        const entity = new Commit();
        spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
        comp.updateForm(entity);
        // WHEN
        comp.save();
        tick(); // simulate async

        // THEN
        expect(service.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      }));
    });
  });
});
