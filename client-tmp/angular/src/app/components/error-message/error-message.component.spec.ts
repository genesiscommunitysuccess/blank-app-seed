import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorMessageComponent } from './error-message.component';

describe('ErrorMessageComponent', () => {
  let component: ErrorMessageComponent;
  let fixture: ComponentFixture<ErrorMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorMessageComponent],
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

    const compiled = fixture.nativeElement;
    const element = compiled.querySelector('h1');
    expect(element).toBeTruthy();
    expect(element.textContent).toContain('Error: Something went wrong!');
  });

  it('should render a message inside an h3 element', () => {
    component.elementType = 'h3';
    component.message = 'Warning: Check your inputs.';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const element = compiled.querySelector('h3');
    expect(element).toBeTruthy();
    expect(element.textContent).toContain('Warning: Check your inputs.');
  });

  it('should render a message inside a p element', () => {
    component.elementType = 'p';
    component.message = 'Info: Your operation was successful.';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const element = compiled.querySelector('p');
    expect(element).toBeTruthy();
    expect(element.textContent).toContain('Info: Your operation was successful.');
  });

  it('should default to div element if no elementType is provided', () => {
    component.elementType = '';
    component.message = 'Default to div element.';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const element = compiled.querySelector('div');
    expect(element.textContent).toContain('Default to div element.');
  });

  it('should apply error-message class to the rendered element', () => {
    component.elementType = 'h2';
    component.message = 'Testing class application.';
    fixture.detectChanges();
   
    const compiled = fixture.nativeElement;
    const element = compiled.querySelector('.error-message');
    expect(element).toBeTruthy();
  });
});