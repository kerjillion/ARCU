import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface EmailMessage {
  to: string;
  subject: string;
  body: string;
  from?: string;
}

@Injectable({ providedIn: 'root' })
export class EmailService {
  /**
   * Simulate sending an email. In a real app, this would POST to a backend API.
   * @param message EmailMessage object
   * @returns Observable of success or error
   */
  sendEmail(message: EmailMessage): Observable<{ success: boolean; message: string }> {
    if (!this.validateEmail(message.to)) {
      return throwError(() => new Error('Invalid recipient email address'));
    }
    // Simulate network delay and success
    return of({ success: true, message: 'Email sent successfully (simulated)' }).pipe(delay(800));
  }

  /**
   * Validate an email address format
   * @param email Email address string
   * @returns true if valid, false otherwise
   */
  validateEmail(email: string): boolean {
    // Simple regex for demonstration
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  }
}

/*
EmailService Documentation
-------------------------

EmailService provides a simple, injectable Angular service for sending and validating emails.

Features:
- `sendEmail(message: EmailMessage)`: Simulates sending an email (replace with real API call in production)
- `validateEmail(email: string)`: Validates email address format
- Designed for easy extension to real backend or third-party email APIs

Usage:
1. Inject EmailService into your component or service:
   constructor(private email: EmailService) {}

2. Send an email:
   this.email.sendEmail({
     to: 'user@example.com',
     subject: 'Hello',
     body: 'This is a test.'
   }).subscribe({
     next: res => console.log(res),
     error: err => console.error(err)
   });

3. Validate an email address:
   const isValid = this.email.validateEmail('test@example.com');
*/
