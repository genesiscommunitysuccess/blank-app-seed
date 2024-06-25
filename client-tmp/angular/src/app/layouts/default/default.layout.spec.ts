import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import * as StateChangerSelector from '../../store/state-changer/state-changer.selectors';

import { DefaultLayoutComponent } from './default.layout';

describe('DefaultLayoutComponent', () => {
  let component: DefaultLayoutComponent;
  let fixture: ComponentFixture<DefaultLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultLayoutComponent],
      providers: [
        provideMockStore({
          initialState: {},
          selectors: [
            { selector: StateChangerSelector.getCriteria, value: 'initial-criteria' },
            { selector: StateChangerSelector.getResourceName, value: 'initial-resource-name' },
          ],
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(DefaultLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
