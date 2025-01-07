import { Component } from '@angular/core'; 
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-index',
  standalone: true,
  imports: [RouterModule, RouterOutlet],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexLayoutComponent {
  constructor(
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
  
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['user/dashboard']); 
    } else {
      this.router.navigate(['/']); 

    }
  }
}
