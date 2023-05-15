import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeSemanalGeneracionComponent } from './informe-semanal-generacion.component';

describe('InformeSemanalGeneracionComponent', () => {
  let component: InformeSemanalGeneracionComponent;
  let fixture: ComponentFixture<InformeSemanalGeneracionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformeSemanalGeneracionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeSemanalGeneracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
