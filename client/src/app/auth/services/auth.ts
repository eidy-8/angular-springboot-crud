import { Injectable, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApiData } from './api-data';

@Injectable({
  providedIn: 'root',
})
export class Auth implements OnDestroy {

  protected unsubscribe = new Subject<void>();
  protected authenticated = false;

  constructor(public apidata: ApiData) { }

  isAuthenticated(): Promise<boolean> {
    return new Promise((resolve) => {
      this.apidata.verifyToken()
        .pipe(
          takeUntil(this.unsubscribe)
        ).subscribe({
          next: () => {
            this.authenticated = true;
            resolve(this.authenticated);
          },
          error: () => {
            resolve(false);
          }
        });
    });
  }

  logout(): void {
    this.apidata.logout().subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
