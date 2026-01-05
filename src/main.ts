import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import Decimal from 'decimal.js';

// Initialize globals before bootstrap
Decimal.set({ precision: 50 });

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
