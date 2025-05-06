import { CommonModule } from '@angular/common';
import { Component, inject, Injector, runInInjectionContext } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Flight, FlightFilter, injectTicketsFacade } from '../../logic-flight';
import { FlightCardComponent, FlightFilterComponent } from '../../ui-flight';
import { FlightService } from '../../logic-flight/data-access/flight.service';


@Component({
  selector: 'app-flight-search',
  imports: [
    CommonModule,
    FormsModule,
    FlightCardComponent,
    FlightFilterComponent
  ],
  templateUrl: './flight-search.component.html'
})
export class FlightSearchComponent {
  private ticketsFacade = injectTicketsFacade();
  private injector = inject(Injector);

  protected filter = {
    from: 'London',
    to: 'New York',
    urgent: false
  };
  protected basket: Record<number, boolean> = {
    3: true,
    5: true
  };
  protected flights$ = this.ticketsFacade.flights$;

  constructor() {
    // this.flightService.findById(5).subscribe(console.log);
  }
  
  protected search(filter: FlightFilter): void {
    runInInjectionContext(
      this.injector,
      () => inject(FlightService).findById(4).subscribe(console.log)
    );

    this.injector.get(FlightService).findById(3).subscribe(console.log);
    
    this.filter = filter;

    if (!this.filter.from || !this.filter.to) {
      return;
    }

    this.ticketsFacade.search(this.filter);
  }

  protected delay(flight: Flight): void {
    const oldFlight = flight;
    const oldDate = new Date(oldFlight.date);

    const newDate = new Date(oldDate.getTime() + 1000 * 60 * 5); // Add 5 min
    const newFlight = {
      ...oldFlight,
      date: newDate.toISOString(),
      delayed: true
    };

    this.ticketsFacade.update(newFlight);
  }

  protected reset(): void {
    this.ticketsFacade.reset();
  }
}
