import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CleanupComponent } from './cleanup.component';

describe('CleanupComponent', () => {
  let component: CleanupComponent;
  let fixture: ComponentFixture<CleanupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CleanupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CleanupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
