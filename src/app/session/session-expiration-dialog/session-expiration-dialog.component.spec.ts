import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionExpirationDialogComponent } from './session-expiration-dialog.component';

describe('SessionExpirationDialogComponent', () => {
  let component: SessionExpirationDialogComponent;
  let fixture: ComponentFixture<SessionExpirationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionExpirationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionExpirationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
