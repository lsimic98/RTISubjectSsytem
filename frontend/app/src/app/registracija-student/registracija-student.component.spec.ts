import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistracijaStudentComponent } from './registracija-student.component';

describe('RegistracijaStudentComponent', () => {
  let component: RegistracijaStudentComponent;
  let fixture: ComponentFixture<RegistracijaStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistracijaStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistracijaStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
