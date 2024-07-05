import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';

@Component({
  selector: 'app-not-permitted-route',
  standalone: true,
  imports: [ ErrorMessageComponent ],
  templateUrl: './not-permitted-route.component.html',
  styleUrls: ['./not-permitted-route.component.scss'],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class NotPermittedRouteComponent {
}
