import { NgIf } from '@angular/common';
import { Component, computed, effect, inject, input, numberAttribute, ResourceStatus } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { initialPassenger } from '../../logic-passenger';
import { PassengerService } from '../../logic-passenger/data-access/passenger.service';
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
  private passengerService = inject(PassengerService);

  id = input.required({ transform: numberAttribute });
  passengerResource = this.passengerService.findByIdAsResource(this.id);
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
