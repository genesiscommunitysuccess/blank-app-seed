import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.css'],
  standalone: true,
  imports: [
    CommonModule,
  ],
})
export class ErrorMessageComponent {
  @Input() elementType: string = 'div';
  @Input() message: string = '';
}