
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/underwriting/components/underwriting-dashboard/underwriting-dashboard')
        .then(m => m.UnderwritingDashboard)
  },
  {
    path: 'underwriting',
    loadComponent: () =>
      import('./features/underwriting/components/underwriting-form/underwriting-form')
        .then(m => m.UnderwritingFormComponent)
  },
  {
    path: 'assessment-result/:applicationId',
    loadComponent: () =>
      import('./features/underwriting/components/assessment-result/assessment-result')
        .then(m => m.AssessmentResult)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];