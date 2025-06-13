import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PersonService } from '../../../api/person.service';

@Component({
	selector: 'app-person-get-all',
	imports: [
		CommonModule
	],
	templateUrl: './person-get-all.component.html',
	styleUrl: './person-get-all.component.css'
})

export class PersonGetAllComponent {
	listPerson: any[] = [];

	constructor(
		private personService: PersonService
	){}

	ngOnInit(): void {
		this.personService.getAll().subscribe({
			next: (response: any) => {
				this.listPerson = response.dto.listPerson;
			},
			error: (error: any) => {
				console.log(error);
			}
		});
	}

	delete(idPerson: string, rowIndex: number) {
		this.personService.delete(idPerson).subscribe({
			next: (response: any) => {
				this.listPerson.splice(rowIndex, 1);
			},
			error: (error: any) => {
				console.log(error);
			}
		});
	}
}