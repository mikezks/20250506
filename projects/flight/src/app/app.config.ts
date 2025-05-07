import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, inject, PLATFORM_ID, provideAppInitializer } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { APP_ROUTES } from './app.routes';
import { provideRouterFeature } from './shared/logic-router-state';
import { provideNavigationService } from './shared/logic-navigation';
import { APP_NAVIGATION } from './app.navigation';
import { provideClientHydration, withEventReplay, withIncrementalHydration } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';
import { of, delay } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES,
      withComponentInputBinding()
    ),
    provideHttpClient(),
    provideStore(),
    provideEffects(),
    provideRouterFeature(),
    provideStoreDevtools(),
    provideNavigationService(APP_NAVIGATION),
    provideClientHydration(
      withEventReplay(),
      withIncrementalHydration()
    ),
    /* provideAppInitializer((
      id = inject(PLATFORM_ID)
    ) => isPlatformServer(id)
      ? of(true)
      : of(true).pipe(delay(10_000))
    ) */
  ]
};
