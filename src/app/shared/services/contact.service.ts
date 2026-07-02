import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactRequest } from '../models/contact-request.model';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://dynstocks.com/restapi/webservices/contactUser';

  submitContact(payload: ContactRequest): Observable<unknown> {
    return this.http.post(this.apiUrl, payload);
  }
}
