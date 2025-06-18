import Swal from 'sweetalert2';

import { CommonModule } from '@angular/common';
import { Component, TemplateRef } from '@angular/core';
import { PersonService } from '../../../api/person.service';
import { DateFormatPipe } from '../../../pipe/date-format.pipe';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProviderService } from '../../../api/provider.service';

@Component({
	selector: 'app-person-get-all',
	imports: [
		CommonModule,
		ReactiveFormsModule,
		DateFormatPipe
	],
	providers: [
		BsModalService
	],
	templateUrl: './person-get-all.component.html',
	styleUrl: './person-get-all.component.css'
})

export class PersonGetAllComponent {
	frmInsertPerson: FormGroup;

	listPerson: any[] = [];
	listPhone: any = [];
	listProvider: any = [];

	tablePhoneIsValid: boolean | null = null;

	idPersonToEdit: string = '';

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
		private providerService: ProviderService,
		private bsModalService: BsModalService
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
		this.loadListPerson();

		this.providerService.getAll().subscribe({
			next: (response: any) => {
				this.listProvider = response.dto.listProvider;
			},
			error: (error: any) => {
				console.log(error);
			}
		});
	}

	private loadListPerson(): void {
		this.personService.getAll().subscribe({
			next: (response: any) => {
				this.listPerson = response.dto.listPerson;
			},
			error: (error: any) => {
				console.log(error);
			}
		});
	}

	public showModalPersonEdit(myModal: TemplateRef<any>, data: any): void {
		this.idPersonToEdit = data.idPerson;
		this.firstNameFb.setValue(data.firstName);
		this.surNameFb.setValue(data.surName);
		this.dniFb.setValue(data.dni);
		this.genderFb.setValue(data.gender ? '1' : '0');
		this.birthDateFb.setValue(data.birthDate);

		this.listPhone = [];

		data.listPhone.forEach((element: any) => {
			this.listPhone.push({
				idProvider: element.provider.idProvider,
				number: element.number,
				provider: element.provider.name
			});
		});

		this.bsModalService.show(myModal, {
			class: 'modal-xl'
		});
	}

	public closeModal(): void {
		this.bsModalService.hide();
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

	public delete(idPerson: string, rowIndex: number) {
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
				this.personService.delete(idPerson).subscribe({
					next: (response: any) => {
						Swal.fire('Correcto!', response.listMessage[0], response.type);

						this.listPerson.splice(rowIndex, 1);
					},
					error: (error: any) => {
						console.log(error);
					}
				});
			}
		});
	}

	public update(): void {
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

				formData.append('idPerson', this.idPersonToEdit);
				formData.append('firstName', this.firstNameFb.value);
				formData.append('surName', this.surNameFb.value);
				formData.append('dni', this.dniFb.value);
				formData.append('gender', this.genderFb.value);
				formData.append('birthDate', this.birthDateFb.value);

				this.listPhone.forEach((element: any, index: number) => {
					formData.append(`listPhone[${index}].idProvider`, element.idProvider);
					formData.append(`listPhone[${index}].number`, element.number);
				});

				this.personService.update(formData).subscribe({
					next: (response: any) => {
						Swal.fire('Correcto!', response.listMessage[0], response.type);

						this.loadListPerson();

						this.closeModal();
					},
					error: (error: any) => {
						console.log(error);
					}
				});
			}
		});
	}
}