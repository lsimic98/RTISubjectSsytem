import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredmetInfoComponent } from './predmet-info.component';

describe('PredmetInfoComponent', () => {
  let component: PredmetInfoComponent;
  let fixture: ComponentFixture<PredmetInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredmetInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredmetInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
