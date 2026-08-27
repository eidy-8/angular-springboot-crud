import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiData {
  
  protected urlRegister = environment.ENV_REGISTER;
  protected urlLogin = environment.ENV_LOGIN;
  protected urlLogout = environment.ENV_LOGOUT;
  protected urlVerifyToken = environment.ENV_VERIFY_TOKEN;

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  constructor(private httpClient: HttpClient) { }

  public postUser(userData: any): Observable<any> {
    return this.httpClient.post<any>(this.urlRegister, JSON.stringify(userData), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  };

  public postLogin(loginData: any): Observable<any> {
    return this.httpClient.post<void>(this.urlLogin, JSON.stringify(loginData), {
      ...this.httpOptions,
      withCredentials: true
    })
      .pipe(
        catchError(this.handleError)
      )
  };

  public verifyToken(): Observable<any> {
    return this.httpClient.get<any>(this.urlVerifyToken, { withCredentials: true })
      .pipe(
        catchError(this.handleError)
      )
  };

  public logout(): Observable<void> {
    return this.httpClient.post<void>(this.urlLogout, null, { withCredentials: true });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
  
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Código do erro: ${error.status}, mensagem: ${error.message}`;
      }
    }
  
    console.error('Erro capturado pelo handleError:', error);
  
    return throwError(() => ({
      status: error.status, 
      message: errorMessage, 
      fullError: error 
    }));
  }
}
