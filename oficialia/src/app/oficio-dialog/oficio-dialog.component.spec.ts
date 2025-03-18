import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OficioDialogComponent } from './oficio-dialog.component';

describe('OficioDialogComponent', () => {
  let component: OficioDialogComponent;
  let fixture: ComponentFixture<OficioDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OficioDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OficioDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
