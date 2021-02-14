import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtiOdsekComponent } from './rti-odsek.component';

describe('RtiOdsekComponent', () => {
  let component: RtiOdsekComponent;
  let fixture: ComponentFixture<RtiOdsekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RtiOdsekComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RtiOdsekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
