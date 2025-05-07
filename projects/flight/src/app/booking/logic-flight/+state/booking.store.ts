import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { tapResponse } from "@ngrx/operators";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { Flight } from "../model/flight";
import { computed, inject } from "@angular/core";
import { FlightFilter } from "../model/flight-filter";
import { FlightService } from "../data-access/flight.service";
import { pipe, switchMap } from "rxjs";


export const BookingStore = signalStore(
    // DI Provider
    { providedIn: 'root' },
    // State
    withState({
        filter: {
            from: 'Hamburg',
            to: 'Graz',
            urgent: false
        },
        basket: {
            3: true,
            5: true
        } as Record<number, boolean>,
        flights: [] as Flight[]
    }),
    // Selectors
    withComputed(store => ({
        delayedFlights: computed(() => store.flights().filter(flight => flight.delayed)),
        flightRoute: computed(
            () => 'From ' + store.filter.from() + ' to ' + store.filter.to() + '.'
        )
    })),
    // Updater
    withMethods(store => ({
        setFilter: (filter: FlightFilter) => patchState(store, { filter }),
        setFlights: (flights: Flight[]) => patchState(store, { flights }),
        setBasket: (
            id: number,
            selected: boolean
        ) => patchState(store, state => ({
            basket: {
                ...state.basket,
                [id]: selected
            }
        })),
    })),
    // Side-Effects
    withMethods((
        store,
        flightService = inject(FlightService)
    ) => ({
        loadFlights: rxMethod<FlightFilter>(pipe(
            switchMap(filter => flightService.find(
                filter.from,
                filter.to,
                filter.urgent
            )),
            tapResponse(
                flights => store.setFlights(flights),
                err => console.error(err)
            )
        )),
    })),
    withHooks(store => ({
        onInit: () => store.loadFlights(store.filter)
    }))
);