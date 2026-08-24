import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { merge, Subject } from 'rxjs';
import { ApiData } from '../../../auth/services/api-data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../services/user';

@Component({
  selector: 'app-config-account',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule, MatCardModule, MatButtonModule],
  templateUrl: './config-account.html',
  styleUrl: './config-account.css',
})
export class ConfigAccount {

  private unsubscribe = new Subject<void>();

  updateForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email])
  });
  
  constructor(public apiData: ApiData, public user: User) {
    merge(this.username.statusChanges, this.username.valueChanges)
    .pipe(takeUntilDestroyed())
    .subscribe(() => this.updateUsernameErrorMessage());

    merge(this.email.statusChanges, this.email.valueChanges)
    .pipe(takeUntilDestroyed())
    .subscribe(() => this.updateEmailErrorMessage());
  }

  readonly username = new FormControl('', [Validators.required]);
  readonly email = new FormControl('', [Validators.required, Validators.email]);

  usernameErrorMessage = signal('');
  emailErrorMessage = signal('');

  protected update(): void {    
    if (!this.updateForm.value.username) {
      this.updateUsernameErrorMessage();
      return;
    }

    if (!this.updateForm.value.email) {
      this.updateEmailErrorMessage();
      return;
    }

    // this.user.update(this.userId, this.userForm.value).pipe( takeUntil( this.unsubscribe ) ).subscribe({
    //   next: () => {
    //     this.successAlertMessage = 'Usuário atualizado com sucesso'
    //     this.alertMessage = null;
    //     this.cdr.detectChanges();
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

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
