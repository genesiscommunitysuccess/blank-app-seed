import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { configureFoundationLogin } from './share/foundation-login';

// Genesis Components
import './share/genesis-components';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {
  title = '{{capitalCase appName}}';

  constructor(
    private router: Router,
  ) {
      configureFoundationLogin({ router });
  }
}
