import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { merge, Subject, takeUntil } from 'rxjs';
import { ApiData } from '../../services/api-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatCardModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  private unsubscribe = new Subject<void>();

  protected loginError = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });
  
  constructor(public apiData: ApiData, private router: Router) {
    merge(this.email.statusChanges, this.email.valueChanges)
    .pipe(takeUntilDestroyed())
    .subscribe(() => this.updateEmailErrorMessage());

    merge(this.password.statusChanges, this.password.valueChanges)
    .pipe(takeUntilDestroyed())
    .subscribe(() => this.updatePasswordErrorMessage());
  }

  readonly email = this.loginForm.controls.email;
  readonly password = this.loginForm.controls.password;

  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');

  protected login(): void {    
    if (!this.loginForm.value.email) {
      this.updateEmailErrorMessage();
      return;
    }

    if (!this.loginForm.value.password) {
      this.updatePasswordErrorMessage();
      return;
    }

    this.apiData.postLogin(this.loginForm.value).pipe( takeUntil( this.unsubscribe ) ).subscribe({
      next: () => {
        this.router.navigate(['user']);
      },
      error: () => {
        this.loginError = true;
      }
    });
  }
  
  updateEmailErrorMessage() {
    if (this.email.hasError('required')) {
      this.emailErrorMessage.set('Digite um valor');
    } else if (this.email.hasError('email')) {
      this.emailErrorMessage.set('E-mail inválido');
    } else {
      this.emailErrorMessage.set('');
    }
  }

  updatePasswordErrorMessage() {
    if (this.password.hasError('required')) {
      this.passwordErrorMessage.set('Digite um valor');
    } else if (this.password.hasError('password')) {
      this.passwordErrorMessage.set('Senha inválida');
    } else {
      this.passwordErrorMessage.set('');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
