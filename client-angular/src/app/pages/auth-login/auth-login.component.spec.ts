import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthMockComponent } from './auth-mock.component';

describe('AuthMockComponent', () => {
  let component: AuthMockComponent;
  let fixture: ComponentFixture<AuthMockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthMockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthMockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
