import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { AutoChangeSetTestModule } from '../../../test.module';
import { ChangeUpdateComponent } from 'app/entities/change/change-update.component';
import { ChangeService } from 'app/entities/change/change.service';
import { Change } from 'app/shared/model/change.model';

describe('Component Tests', () => {
  describe('Change Management Update Component', () => {
    let comp: ChangeUpdateComponent;
    let fixture: ComponentFixture<ChangeUpdateComponent>;
    let service: ChangeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [AutoChangeSetTestModule],
        declarations: [ChangeUpdateComponent],
        providers: [FormBuilder]
      })
        .overrideTemplate(ChangeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ChangeUpdateComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ChangeService);
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', fakeAsync(() => {
        // GIVEN
        const entity = new Change(123);
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
        const entity = new Change();
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
