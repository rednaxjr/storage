import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from "@angular/common/http";
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthInterceptor } from './_helpers/auth.interceptor';
// import { authInterceptor } from './_helpers/auth.interceptor'; // Adjust path as necessary
import { AuthService } from './services/auth.service';

import { MatIconModule } from '@angular/material/icon';
import { AuthGuard } from './services/auth.guard';
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(),
    ),
    MatIconModule, 
    AuthService,
    AuthGuard,
  ],
};
