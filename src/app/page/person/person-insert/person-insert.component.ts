import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'app-person-insert',
	imports: [
		CommonModule,
		ReactiveFormsModule
	],
	templateUrl: './person-insert.component.html',
	styleUrl: './person-insert.component.css'
})
export class PersonInsertComponent {
	frmInsertPerson: FormGroup;

	listPhone: any = [];
	listProvider: any = [];

	get firstNameFb() { return this.frmInsertPerson.controls['firstName']; }
	get surNameFb() { return this.frmInsertPerson.controls['surName']; }
	get dniFb() { return this.frmInsertPerson.controls['dni']; }
	get genderFb() { return this.frmInsertPerson.controls['gender']; }
	get birthDateFb() { return this.frmInsertPerson.controls['birthDate']; }
	get numberPhoneFb() { return this.frmInsertPerson.controls['numberPhone']; }
	get idProviderFb() { return this.frmInsertPerson.controls['idProvider']; }

	constructor(
		private formBuilder: FormBuilder
	) {
		this.frmInsertPerson = this.formBuilder.group({
			'firstName': ['', []],
			'surName': ['', []],
			'dni': ['', []],
			'gender': ['', []],
			'birthDate': ['', []],
			'numberPhone': ['', []],
			'idProvider': ['', []]
		});
	}

	ngOnInit(): void {
		this.listProvider.push({
			idProvider: '1',
			name: 'Claro'
		});

		this.listProvider.push({
			idProvider: '2',
			name: 'Movistar'
		});
	}

	public clickAddPhone(): void {
		this.listPhone.push({
			number: this.numberPhoneFb.value,
			provider: this.listProvider.filter((x: any) => x.idProvider == this.idProviderFb.value)[0].name
		});

		this.numberPhoneFb.setValue('');
	}
}