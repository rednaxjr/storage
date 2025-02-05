import { Component, ViewChild, HostListener } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Routes, RouterModule, Router, RouterOutlet, RouterLink, RouterLinkActive, } from '@angular/router';
 
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormControl, FormGroup, FormsModule } from '@angular/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';   
import { StorageService } from '../../../services/storage.service'; 
import { AuthService } from '../../../services/auth.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule, MatMenuModule, MatButtonModule ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserLayoutComponent {
  isHandset: boolean = false; 
  user:any={}
  isOpen:boolean=true;
  isXSmall: boolean=false;
  isMedium: boolean=false;
  isXLarge: boolean=false; 
  isLarge: boolean=false; 
  isSmall: boolean=false; 
  isSide:boolean=true;
  constructor(
   
    private router: Router,
    private storageService: StorageService,
    private authService:AuthService,
    private breakpointObserver: BreakpointObserver
    
  ) {  
    const decodedToken = this.storageService.getDecodedToken('token');
 
    this.user = decodedToken;  
  }

  sideBarRoutes = [
    { path: 'dashboard', name: "Dashboard", icon: "dashboard" },
    { path: 'files', name: "Files", icon: "description" },
    
    
  ]


  private screenWidth$ = new BehaviorSubject<number>
    (window.innerWidth);


  ngOnInit(): void {
    this.breakpointObserver.observe([ 
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe(result => {
      this.isXSmall = result.breakpoints[Breakpoints.XSmall];
      this.isSmall = result.breakpoints[Breakpoints.Small];
      this.isMedium = result.breakpoints[Breakpoints.Medium];
      this.isLarge = result.breakpoints[Breakpoints.Large];
      this.isXLarge = result.breakpoints[Breakpoints.XLarge];
      if (this.isMedium || this.isLarge || this.isLarge || this.isXLarge) {
        this.isSide = false;
        this.isOpen = true;
      }else{
        this.isOpen = false;
        this.isSide = true;
      }

    });

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['user/dashboard']);
 
    } else {
      this.router.navigate(['/']); 
    }
  }
  logout() {
    this.storageService.clear();
    window.location.reload();
  }
}