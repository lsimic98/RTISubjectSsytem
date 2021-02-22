import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObavestenjePredmetComponent } from './obavestenje-predmet.component';

describe('ObavestenjePredmetComponent', () => {
  let component: ObavestenjePredmetComponent;
  let fixture: ComponentFixture<ObavestenjePredmetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObavestenjePredmetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObavestenjePredmetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
