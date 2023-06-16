import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeSemanalConfupdComponent } from './informe-semanal-confupd.component';

describe('InformeSemanalConfupdComponent', () => {
  let component: InformeSemanalConfupdComponent;
  let fixture: ComponentFixture<InformeSemanalConfupdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformeSemanalConfupdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeSemanalConfupdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
