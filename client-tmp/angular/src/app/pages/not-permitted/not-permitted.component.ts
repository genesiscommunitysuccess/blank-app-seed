import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';

@Component({
  selector: 'app-not-permitted',
  standalone: true,
  imports: [ ErrorMessageComponent ],
  templateUrl: './not-permitted.component.html',
  styleUrls: ['./not-permitted.component.scss'],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class NotPermittedComponent {
}
