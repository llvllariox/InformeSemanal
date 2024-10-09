import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioInformeSemanalComponent } from './formulario-informe-semanal.component';

describe('FormularioInformeSemanalComponent', () => {
  let component: FormularioInformeSemanalComponent;
  let fixture: ComponentFixture<FormularioInformeSemanalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioInformeSemanalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioInformeSemanalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
