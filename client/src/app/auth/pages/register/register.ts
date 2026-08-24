import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { merge, Subject } from 'rxjs';
import { ApiData } from '../../services/api-data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-register',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatCardModule, MatButtonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  private unsubscribe = new Subject<void>();

  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });
  
  constructor(public apiData: ApiData) {
    merge(this.username.statusChanges, this.username.valueChanges)
    .pipe(takeUntilDestroyed())
    .subscribe(() => this.updateUsernameErrorMessage());

    merge(this.email.statusChanges, this.email.valueChanges)
    .pipe(takeUntilDestroyed())
    .subscribe(() => this.updateEmailErrorMessage());

    merge(this.password.statusChanges, this.password.valueChanges)
    .pipe(takeUntilDestroyed())
    .subscribe(() => this.updatePasswordErrorMessage());
  }

  readonly username = new FormControl('', [Validators.required]);
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required]);

  usernameErrorMessage = signal('');
  emailErrorMessage = signal('');
  passwordErrorMessage = signal('');

  protected register(): void {   
    if (!this.registerForm.value.username) {
      this.updateUsernameErrorMessage();
      return;
    }
    
    if (!this.registerForm.value.email) {
      this.updateEmailErrorMessage();
      return;
    }

    if (!this.registerForm.value.password) {
      this.updatePasswordErrorMessage();
      return;
    }

    // this.apiData.postUser(this.registerForm.value).pipe( takeUntil( this.unsubscribe ) ).subscribe({
    //   next: () => {
    //     this.router.navigate(['auth/login']);
    //   },
    //   error: error => {
    //     this.alertMessage = error.message;
    //     this.cdr.detectChanges();
    //   }
    // });
  }

  updateUsernameErrorMessage() {
    if (this.username.hasError('required')) {
      this.usernameErrorMessage.set('Digite um valor');
    } else if (this.username.hasError('username')) {
      this.usernameErrorMessage.set('Senha inválida');
    } else {
      this.usernameErrorMessage.set('');
    }
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
