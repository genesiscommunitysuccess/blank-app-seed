import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorMessageComponent } from './error-message.component';
import { By } from '@angular/platform-browser';

describe('ErrorMessageComponent', () => {
  let component: ErrorMessageComponent;
  let fixture: ComponentFixture<ErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorMessageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a message inside an h1 element', () => {
    component.elementType = 'h1';
    component.message = 'Error: Something went wrong!';
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('h1.error-message'));
    expect(element).toBeTruthy();
    expect(element.nativeElement.textContent).toContain('Error: Something went wrong!');
  });

  it('should render a message inside an h3 element', () => {
    component.elementType = 'h3';
    component.message = 'Warning: Check your inputs.';
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('h3.error-message'));
    expect(element).toBeTruthy();
    expect(element.nativeElement.textContent).toContain('Warning: Check your inputs.');
  });

  it('should render a message inside a p element', () => {
    component.elementType = 'p';
    component.message = 'Info: Your operation was successful.';
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('p.error-message'));
    expect(element).toBeTruthy();
    expect(element.nativeElement.textContent).toContain('Info: Your operation was successful.');
  });

  it('should default to div element if no elementType is provided', () => {
    component.elementType = '';
    component.message = 'Default to div element.';
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('div.error-message'));
    expect(element).toBeTruthy();
    expect(element.nativeElement.textContent).toContain('Default to div element.');
  });

  it('should apply error-message class to the rendered element', () => {
    component.elementType = 'h2';
    component.message = 'Testing class application.';
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('h2.error-message'));
    expect(element).toBeTruthy();
    expect(element.nativeElement.classList).toContain('error-message');
  });
});