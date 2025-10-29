import { Component, signal } from '@angular/core';
import { RouterLink , RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  imports:[RouterOutlet],
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('Frontend');
}
