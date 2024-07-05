import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-not-permitted-component',
  standalone: true,
  imports: [],
  templateUrl: './not-permitted.component.html',
  styleUrls: ['./not-permitted.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NotPermittedComponent {}
