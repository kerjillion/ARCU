import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MaterialModule, ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {
  protected title = 'ARCU';

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(private http: HttpClient) {}

  onSubmit() {
    if (this.form.valid) {
      alert('Form submitted!\n' + JSON.stringify(this.form.value, null, 2));
    }
  }

  fetchSampleData() {
    this.http.get('https://jsonplaceholder.typicode.com/users/1').subscribe({
      next: data => alert('Fetched user data:\n' + JSON.stringify(data, null, 2)),
      error: err => alert('API error: ' + err.message)
    });
  }

  theme = signal<'light' | 'dark'>('light');

  toggleTheme() {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
    document.body.classList.toggle('dark-theme', this.theme() === 'dark');
    document.body.classList.toggle('light-theme', this.theme() === 'light');
  }

  ngOnInit() {
    document.body.classList.add('light-theme');
  }
}

export { AppComponent as App };
