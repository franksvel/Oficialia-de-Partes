import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OficeComponent } from './ofice.component';

describe('OficeComponent', () => {
  let component: OficeComponent;
  let fixture: ComponentFixture<OficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OficeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
