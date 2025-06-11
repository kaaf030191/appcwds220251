import { Routes } from '@angular/router';
import { PersonInsertComponent } from './page/person/person-insert/person-insert.component';
import { PersonGetAllComponent } from './page/person/person-get-all/person-get-all.component';

export const routes: Routes = [
	{ path: 'person/insert', component: PersonInsertComponent },
	{ path: 'person/getall', component: PersonGetAllComponent }
];