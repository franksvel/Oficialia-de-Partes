import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashcontainerComponent } from './dashcontainer.component';

describe('DashcontainerComponent', () => {
  let component: DashcontainerComponent;
  let fixture: ComponentFixture<DashcontainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashcontainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashcontainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
