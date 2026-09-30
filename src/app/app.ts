import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UnderwritingFormComponent } from './features/underwriting/components/underwriting-form/underwriting-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,UnderwritingFormComponent],
  template: `<app-underwriting-form />`,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('insurance-underwriting-ui');
}
