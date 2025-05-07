import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Flight, FlightFilter, injectTicketsFacade } from '../../logic-flight';
import { FlightCardComponent, FlightFilterComponent } from '../../ui-flight';


@Component({
  selector: 'app-flight-search',
  imports: [
    JsonPipe,
    FormsModule,
    FlightCardComponent,
    FlightFilterComponent
  ],
  templateUrl: './flight-search.component.html'
})
export class FlightSearchComponent {
  private ticketsFacade = injectTicketsFacade();

  protected filter = this.ticketsFacade.filter;
  protected basket = this.ticketsFacade.basket;
  protected flights = this.ticketsFacade.flights;
  protected route = this.ticketsFacade.route;

  protected search(filter: FlightFilter): void {  
    if (!filter.from || !filter.to) {
      return;
    }

    this.ticketsFacade.search(filter);
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

  protected updateBasket(
    id: number,
    selected: boolean
  ): void {
    this.ticketsFacade.updateBasket(id, selected);
  }
}
