import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DefaultLayoutComponent } from './default.layout';
import { ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

class MockRouter {
  navigate = jest.fn();
}

class MockElementRef implements ElementRef {
  nativeElement = {};
}

describe('DefaultLayoutComponent', () => {
  let component: DefaultLayoutComponent;
  let fixture: ComponentFixture<DefaultLayoutComponent>;
  let router: MockRouter;
  let elementRef: MockElementRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefaultLayoutComponent],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: ElementRef, useClass: MockElementRef }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultLayoutComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as unknown as MockRouter;
    elementRef = TestBed.inject(ElementRef) as unknown as MockElementRef;
    component.designSystemProviderElement = elementRef;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to a path', () => {
    const path = 'some/path';
    component.navigateAngular(path);
    expect(router.navigate).toHaveBeenCalledWith([path]);
  });
});