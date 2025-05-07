import { NgIf } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, computed, effect, inject, input, numberAttribute, ResourceStatus } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { initialPassenger, Passenger } from '../../logic-passenger';
import { validatePassengerStatus } from '../../util-validation';


@Component({
  selector: 'app-passenger-edit',
  imports: [
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './passenger-edit.component.html'
})
export class PassengerEditComponent {
  id = input.required({ transform: numberAttribute });
  passengerResource = httpResource<Passenger>(() => ({
    url: 'https://demo.angulararchitects.io/api/passenger',
    params: { id: this.id() }
  }), { defaultValue: initialPassenger });
  passengerResourceState = computed(() => ResourceStatus[this.passengerResource.status()]);

  protected editForm = inject(NonNullableFormBuilder).group({
    id: [0],
    firstName: ['INIT'],
    name: [''],
    bonusMiles: [0],
    passengerStatus: ['', [
      validatePassengerStatus(['A', 'B', 'C'])
    ]]
  });

  constructor() {
    effect(() => {
      if (this.passengerResource.hasValue()) {
        this.editForm.patchValue(
          this.passengerResource.value()
        );
      }
    });
  }

  protected save(): void {
    console.log(this.editForm.value);
    this.passengerResource.set(this.editForm.getRawValue());
  }
}
