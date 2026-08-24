import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule, RouterLink, RouterOutlet],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  private readonly router = inject(Router, { optional: true });

  readonly username = sessionStorage.getItem('Session-Username')
    ?? sessionStorage.getItem('username')
    ?? 'Usuário';
  readonly email = sessionStorage.getItem('Session-Email')
    ?? sessionStorage.getItem('email')
    ?? 'E-mail não informado';

  logout(): void {
    sessionStorage.clear();
    void this.router?.navigate(['/auth/login']);
  }
}
