import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { AutoChangeSetTestModule } from '../../../test.module';
import { ChangeSetUpdateComponent } from 'app/entities/change-set/change-set-update.component';
import { ChangeSetService } from 'app/entities/change-set/change-set.service';
import { ChangeSet } from 'app/shared/model/change-set.model';

describe('Component Tests', () => {
  describe('ChangeSet Management Update Component', () => {
    let comp: ChangeSetUpdateComponent;
    let fixture: ComponentFixture<ChangeSetUpdateComponent>;
    let service: ChangeSetService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AutoChangeSetTestModule],
        declarations: [ChangeSetUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ChangeSetUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ChangeSetUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ChangeSetService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new ChangeSet(123);
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
        const entity = new ChangeSet();
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
