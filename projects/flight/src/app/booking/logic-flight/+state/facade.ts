import { inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { Flight } from "../model/flight";
import { FlightFilter } from "../model/flight-filter";
import { BookingStore } from "./booking.store";


export function injectTicketsFacade() {
  const store = inject(BookingStore);

  return {
    filter: store.filter,
    basket: store.basket,
    flights: store.flights,
    route: store.flightRoute,
    search: (filter: FlightFilter) => store.setFilter(filter),
    update: (flight: Flight) => {},
    updateBasket: (
      id: number,
      selected: boolean
    ) => store.setBasket(id, selected),
    reset: () => {
      store.setFlights([])
    }
  };
}
