import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthApi } from '../../../auth/service/auth-api';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isSidebarOpen = false;
  private innerWidth = 0;
 
  constructor(private authService:AuthApi){}
  ngOnInit() {
    this.innerWidth = window.innerWidth;
    // Auto-open sidebar on desktop
    if (this.innerWidth > 767) {
      this.isSidebarOpen = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = event.target.innerWidth;
    if (this.innerWidth > 767) {
      this.isSidebarOpen = true;
    }
  }

  toggleSidebar() {
    if (this.innerWidth <= 767) {
      this.isSidebarOpen = !this.isSidebarOpen;
    }
  }

  openSidebar() {
    this.isSidebarOpen = true;
  }

  closeSidebar() {
    if (this.innerWidth <= 767) {
      this.isSidebarOpen = false;
    }
  }

  onMobileNavClick() {
    this.closeSidebar();
  }

  createNewChat() {
    console.log('Creating new chat...');
    this.closeSidebar();
  }

  logout() { 
     alert("log out clicked");
    this.authService.revokeRefreshToken().pipe(
      finalize(() => {
        this.authService.logout();
      })
    ).subscribe(() => { })
  }
}