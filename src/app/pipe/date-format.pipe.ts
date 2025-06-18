import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'dateFormat'
})

export class DateFormatPipe implements PipeTransform {
	transform(value: string, ...args: string[]): string {
		let finlaValue: string = '';

		if(args[0] == 'full') {
			let tempValue: string[] = value.split('T');
			let tempValueDate: string[] = tempValue[0].split('-');
			let tempValueHour: string[] = tempValue[1].split(':');

			finlaValue = `${tempValueDate[2]}/${tempValueDate[1]}/${tempValueDate[0]} ${tempValueHour[0]}:${tempValueHour[1]}:${tempValueHour[2].substring(0, 2)}`;
		} else {
			let tempValue: string[] = value.split('-');

			finlaValue = `${tempValue[2]}/${tempValue[1]}/${tempValue[0]}`;
		}

		return finlaValue;
	}
}