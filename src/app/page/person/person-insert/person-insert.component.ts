import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonService } from '../../../api/person.service';
import { ProviderService } from '../../../api/provider.service';

import Swal from 'sweetalert2';

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

	tablePhoneIsValid: boolean | null = null;

	get firstNameFb() { return this.frmInsertPerson.controls['firstName']; }
	get surNameFb() { return this.frmInsertPerson.controls['surName']; }
	get dniFb() { return this.frmInsertPerson.controls['dni']; }
	get genderFb() { return this.frmInsertPerson.controls['gender']; }
	get birthDateFb() { return this.frmInsertPerson.controls['birthDate']; }
	get numberPhoneFb() { return this.frmInsertPerson.controls['numberPhone']; }
	get idProviderFb() { return this.frmInsertPerson.controls['idProvider']; }

	constructor(
		private formBuilder: FormBuilder,
		private personService: PersonService,
		private providerService: ProviderService
	) {
		this.frmInsertPerson = this.formBuilder.group({
			'firstName': ['', [Validators.required]],
			'surName': ['', [Validators.required]],
			'dni': ['', [Validators.required, Validators.pattern(/^([0-9]{8})?$/)]],
			'gender': ['', [Validators.required]],
			'birthDate': ['', [Validators.required]],
			'numberPhone': ['', []],
			'idProvider': ['', []]
		});
	}

	ngOnInit(): void {
		this.providerService.getAll().subscribe({
			next: (response: any) => {
				this.listProvider = response.dto.listProvider;
			},
			error: (error: any) => {
				console.log(error);
			}
		});
	}

	public clickAddPhone(): void {
		this.numberPhoneFb.setValidators([Validators.required]);
		this.idProviderFb.setValidators([Validators.required]);

		this.numberPhoneFb.updateValueAndValidity();
		this.idProviderFb.updateValueAndValidity();

		if(!this.numberPhoneFb.valid || !this.idProviderFb.valid) {
			this.numberPhoneFb.markAllAsTouched();
			this.idProviderFb.markAllAsTouched();

			this.numberPhoneFb.markAsDirty();
			this.idProviderFb.markAsDirty();

			return;
		}

		this.numberPhoneFb.clearValidators();
		this.idProviderFb.clearValidators();

		this.numberPhoneFb.updateValueAndValidity();
		this.idProviderFb.updateValueAndValidity();

		this.listPhone.push({
			number: this.numberPhoneFb.value,
			idProvider: this.idProviderFb.value,
			provider: this.listProvider.filter((x: any) => x.idProvider == this.idProviderFb.value)[0].name
		});

		this.tablePhoneIsValid = true;

		this.numberPhoneFb.setValue('');
	}

	public clickDeletePhone(index: number): void {
		this.listPhone.splice(index, 1);

		this.tablePhoneIsValid = this.listPhone.length > 0;
	}

	public save(): void {
		this.numberPhoneFb.clearValidators();
		this.idProviderFb.clearValidators();

		this.numberPhoneFb.updateValueAndValidity();
		this.idProviderFb.updateValueAndValidity();

		this.tablePhoneIsValid = this.listPhone.length > 0;

		if(!this.frmInsertPerson.valid || !this.tablePhoneIsValid) {
			this.frmInsertPerson.markAllAsTouched();
			this.frmInsertPerson.markAsDirty();

			return;
		}

		Swal.fire({
			title: 'Confirmación!',
			text: '¿Confirmar operación?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Sí, proceder',
			cancelButtonText: 'No, cancelar',
			reverseButtons: true
		}).then((result) => {
			if (result.isConfirmed) {
				let formData = new FormData();

				formData.append('firstName', this.firstNameFb.value);
				formData.append('surName', this.surNameFb.value);
				formData.append('dni', this.dniFb.value);
				formData.append('gender', this.genderFb.value);
				formData.append('birthDate', this.birthDateFb.value);

				this.listPhone.forEach((element: any, index: number) => {
					formData.append(`listPhone[${index}].idProvider`, element.idProvider);
					formData.append(`listPhone[${index}].number`, element.number);
				});

				this.personService.insert(formData).subscribe({
					next: (response: any) => {
						Swal.fire('Correcto!', response.listMessage[0], response.type);
					},
					error: (error: any) => {
						console.log(error);
					}
				});
			}
		});
	}
}