import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
	selector: 'cp-error-message',
	imports: [
		CommonModule
	],
	templateUrl: './cp-error-message.component.html',
	styleUrl: './cp-error-message.component.css'
})

export class CpErrorMessageComponent {
	@Input() listErrorMessage: any[] = [];
}