import { Component, TemplateRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
	selector: 'app-root',
	imports: [RouterOutlet],
	providers: [
		BsModalService
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent {
	constructor(
		private modalService: BsModalService
	) {}

	showModal(myModal: TemplateRef<any>): void {
		this.modalService.show(myModal);
	}

	closeModal(): void {
		this.modalService.hide();
	}
}