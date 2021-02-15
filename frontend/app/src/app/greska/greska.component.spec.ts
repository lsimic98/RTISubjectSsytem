import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreskaComponent } from './greska.component';

describe('GreskaComponent', () => {
  let component: GreskaComponent;
  let fixture: ComponentFixture<GreskaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GreskaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GreskaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
