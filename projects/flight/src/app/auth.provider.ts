import { InjectionToken, signal, WritableSignal } from "@angular/core";


export const isAllowed = new InjectionToken<WritableSignal<boolean>>('isAllowed', {
    providedIn: 'root',
    factory: () => signal(false)
});
