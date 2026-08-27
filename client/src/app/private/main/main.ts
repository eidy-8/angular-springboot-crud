import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Auth } from '../../auth/services/auth';
import { Subject, takeUntil } from 'rxjs';
import { ApiData } from '../../auth/services/api-data';

@Component({
  selector: 'app-main',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule, RouterLink, RouterOutlet],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {

  protected unsubscribe = new Subject<void>();

  protected userName!: string; 
  protected userEmail!: string;

  constructor(private auth: Auth, private router: Router, public apidata: ApiData) {}

  ngOnInit(): void {
    this.getUserInfo();
  }

  protected getUserInfo() {

    this.apidata.verifyToken()
    .pipe(
      takeUntil(this.unsubscribe)
    ).subscribe({
      next: res => {
        this.userName = res.name;
        this.userEmail = res.email;
      },
      error: () => {
      }
    });
  };

  logout(): void {
    this.auth.logout()
    
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
