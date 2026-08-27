import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { merge, Subject, takeUntil } from 'rxjs';
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

  alertMessage: string | null = null;

  successAlertMessage: string | null = null;

  private unsubscribe = new Subject<void>();

  protected userId!: string;
  protected userName!: string; 
  protected userEmail!: string;

  updateForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email])
  });
  
  constructor(public apiData: ApiData, public user: User, public apidata: ApiData, private cdr: ChangeDetectorRef) {
    merge(this.username.statusChanges, this.username.valueChanges)
    .pipe(takeUntilDestroyed())
    .subscribe(() => this.updateUsernameErrorMessage());

    merge(this.email.statusChanges, this.email.valueChanges)
    .pipe(takeUntilDestroyed())
    .subscribe(() => this.updateEmailErrorMessage());
  }

  ngOnInit(): void {
    this.getUserInfo();
  }

  protected getUserInfo() {

    this.apidata.verifyToken()
    .pipe(
      takeUntil(this.unsubscribe)
    ).subscribe({
      next: res => {        
        this.userId = res.id;
        this.userName = res.name;
        this.userEmail = res.email;

        this.updateForm.patchValue({
          name: res.name,
          email: res.email
        });

      },
      error: () => {
      }
    });
  };

  readonly username = this.updateForm.controls.name;
  readonly email = this.updateForm.controls.email;

  usernameErrorMessage = signal('');
  emailErrorMessage = signal('');

  protected update(): void {    
    if (!this.updateForm.value.name) {
      this.updateUsernameErrorMessage();
      return;
    }

    if (!this.updateForm.value.email) {
      this.updateEmailErrorMessage();
      return;
    }

    this.user.update(this.userId, this.updateForm.value).pipe( takeUntil( this.unsubscribe ) ).subscribe({
      next: () => {
        this.successAlertMessage = 'Usuário atualizado com sucesso'
        this.alertMessage = null;
        this.cdr.detectChanges();
      },
      error: error => {
        this.alertMessage = error.message;
        this.cdr.detectChanges();
      }
    });
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
