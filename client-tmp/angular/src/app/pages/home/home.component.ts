import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-protected',
  standalone: true,
  imports: [
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {

}
