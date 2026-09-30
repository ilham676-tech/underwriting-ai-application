import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-underwriting-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './underwriting-form.html',
  styleUrl: './underwriting-form.scss'
})
export class UnderwritingFormComponent {

  private readonly fb = inject(FormBuilder);

  underwritingForm = this.fb.nonNullable.group({

    applicant: this.fb.nonNullable.group({
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ]
    }),

    property: this.fb.nonNullable.group({

      propertyType: [
        '',
        Validators.required
      ],

      location: [
        '',
        Validators.required
      ],

      yearBuilt: [
        2000,
        [
          Validators.required,
          Validators.min(1800),
          Validators.max(new Date().getFullYear())
        ]
      ],

      propertyValue: [
        100000,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      roofAge: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(100)
        ]
      ],

      previousClaims: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(50)
        ]
      ],

      fireProtection: [false],

      securitySystem: [false],

      swimmingPool: [false],

      trampoline: [false]
    })
  });

  submit(): void {

    if (this.underwritingForm.invalid) {
      this.underwritingForm.markAllAsTouched();
      return;
    }

    console.log(
      this.underwritingForm.getRawValue()
    );
  }
}