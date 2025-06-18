import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class PersonService {
	constructor(
		private httpClient: HttpClient
	) { }

	public insert(formData: FormData): Observable<any> {
		return this.httpClient.post('http://localhost:8080/person/insert', formData);
	}

	public update(formData: FormData): Observable<any> {
		return this.httpClient.post('http://localhost:8080/person/update', formData);
	}

	public getAll(): Observable<any> {
		return this.httpClient.get('http://localhost:8080/person/getall');
	}

	public delete(idPerson: string): Observable<any> {
		return this.httpClient.delete(`http://localhost:8080/person/delete/${idPerson}`);
	}
}