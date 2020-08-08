import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { StudentsComponent } from './components/students/students.component';
import { ComplexityComponent } from './components/complexity/complexity.component';
/* Routing */
import { APP_ROUTES } from './app.routes';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import * as hljs from 'highlight.js';
(document.defaultView as any).hljs = hljs;

import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    StudentsComponent,
    ComplexityComponent,
  ],
  imports: [
    HighlightModule,
    BrowserAnimationsModule,
    NgxGraphModule,
    NgxChartsModule,
    BrowserModule,
    APP_ROUTES
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/highlight'),
        lineNumbersLoader: () => import('highlightjs-line-numbers.js'),
        languages: {
          javascript: () => import('highlight.js/lib/languages/javascript'),
          java: () => import('highlight.js/lib/languages/java'),
          php: () => import('highlight.js/lib/languages/php')
        },
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
