import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZaposlenUpdateComponent } from './zaposlen-update.component';

describe('ZaposlenUpdateComponent', () => {
  let component: ZaposlenUpdateComponent;
  let fixture: ComponentFixture<ZaposlenUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZaposlenUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZaposlenUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
