import { Routes, RouterModule } from '@angular/router';

import { ComplexityComponent } from './components/complexity/complexity.component';
import { StudentsComponent } from './components/students/students.component';


const APP_ROUTING: Routes = [
  { path: 'students', component: StudentsComponent },
  { path: 'complexity', component: ComplexityComponent },
  { path: '**', component: StudentsComponent },
];

export const APP_ROUTES = RouterModule.forRoot(APP_ROUTING);

