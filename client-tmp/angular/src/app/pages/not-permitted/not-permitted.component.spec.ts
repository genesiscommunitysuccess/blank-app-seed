import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotPermittedComponent } from './not-permitted.component';

const MESSAGE_NOT_PERMITTED = 'You do not have permission to access this part of the application, please contact your administrator.';

describe('NotPermittedComponent', () => {
  let component: NotPermittedComponent;
  let fixture: ComponentFixture<NotPermittedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ NotPermittedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotPermittedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct error message', () => {
    const compiled = fixture.nativeElement;
    const errorMessageElement = compiled.querySelector('app-error-message h1');
    expect(errorMessageElement.textContent).toBe(MESSAGE_NOT_PERMITTED);
  });
});