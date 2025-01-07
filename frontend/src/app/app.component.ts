import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
  indexBG = 'src/assets/img/background.jpg';
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
  ) {  }
}
