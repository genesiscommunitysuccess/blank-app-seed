import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotPermittedRouteComponent } from './not-permitted-route.component';

describe('NotPermittedRouteComponent', () => {
  let component: NotPermittedRouteComponent;
  let fixture: ComponentFixture<NotPermittedRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotPermittedRouteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NotPermittedRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
