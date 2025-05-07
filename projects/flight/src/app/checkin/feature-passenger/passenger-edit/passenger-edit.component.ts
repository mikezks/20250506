import { NgIf } from '@angular/common';
import { Component, effect, inject, input, numberAttribute, signal, untracked } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { validatePassengerStatus } from '../../util-validation';
import { initialPassenger } from '../../logic-passenger';
import { PassengerService } from '../../logic-passenger/data-access/passenger.service';
import { switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';


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
  id$ = toObservable(this.id);
  passenger$ = this.id$.pipe(
    switchMap(id => this.passengerService.findById(id))
  );
  passenger = toSignal(this.passenger$, {
    // requireSync: true,
    initialValue: initialPassenger
  });

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
    effect(() => this.editForm.patchValue(
      this.passenger()
    ));
  }

  protected save(): void {
    console.log(this.editForm.value);
  }
}
