import { Component, OnInit} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service'; 

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink,CommonModule,
    MatMenuModule, MatButtonModule,MatIconModule,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent  implements OnInit {
  username: string | null = null; 

  constructor(private router: Router,
   public _authService : AuthService,
  ) {}

  ngOnInit(): void {
    // usuario actual
    this._authService.getCurrentUser$().subscribe((user) => {
      this.username = user?.username ? user.username.split(' ')[0] : null;
    });
  }

  logOut() {
    this._authService.logout();
  }
}
