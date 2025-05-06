import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListacircularComponent } from './listacircular.component';

describe('ListacircularComponent', () => {
  let component: ListacircularComponent;
  let fixture: ComponentFixture<ListacircularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListacircularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListacircularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
