// services/security.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  theUser = new BehaviorSubject<User>(new User);

  constructor(private http: HttpClient, private router: Router) {
    this.verifyActualSession()
  }

  /**
   * Realiza la petición al backend con el correo y la contraseña.
   */
  login(user: User): Observable<any> {
    return this.http.post<any>(`${environment.url_ms_security}/api/public/security/login`, user);
  }

  /**
   * Envía el código 2FA al backend para su validación final.
   */
  verifyCode(email: string, code: number): Observable<any> {
    return this.http.post<any>(`${environment.url_ms_security}/api/public/security/login/validate/${code}`, {
        email: email,
    }).pipe(
        tap(data => {
            // Cuando la verificación es exitosa, guardamos la sesión final con el token.
            this.saveSession(data);
        })
    );
  }

  /**
   * ¡CORREGIDO!
   * Guarda los datos del usuario temporalmente después del login.
   * Usa la estructura de respuesta correcta: dataSesion['user'].
   */
  saveTemporarySession(dataSesion: any) {
    let tempUserData: Partial<User> = {
        _id: dataSesion['user']['_id'],
        name: dataSesion['user']['name'],
        email: dataSesion['user']['email'],
    };
    localStorage.setItem('temp-user', JSON.stringify(tempUserData));
  }

  /**
   * Obtiene la información del usuario de la sesión temporal.
   */
  getTemporarySession(): User | null {
    let dataString = localStorage.getItem('temp-user');
    if (dataString) {
        return JSON.parse(dataString);
    }
    return null;
  }

  /**
   * ¡CORREGIDO!
   * Guarda la sesión FINAL (con el token) después de una verificación 2FA exitosa.
   * Usa la estructura de respuesta correcta: dataSesion['user'] y dataSesion['token'].
   */
  saveSession(dataSesion: any) {
    let userData: User = {
      _id: dataSesion['user']['_id'],
      name: dataSesion['user']['name'],
      email: dataSesion['user']['email'],
      password: "", // Nunca guardar la contraseña
      token: dataSesion['token'],
    };
    localStorage.setItem('sesion', JSON.stringify(userData));
    this.setUser(userData);
  }

  /**
   * Realiza la petición al backend para registrar un nuevo usuario.
   */
  register(user: User): Observable<any> {
    return this.http.post<any>(`${environment.url_ms_security}/api/public/users`, user);
  }

  /**
   * Actualiza el BehaviorSubject con los datos del usuario logueado.
   */
  setUser(user: User) {
    this.theUser.next(user);
  }

  /**
   * Permite a otros componentes suscribirse a los datos del usuario.
   */
  getUser() {
    return this.theUser.asObservable();
  }

  /**
   * Permite obtener el valor actual de la sesión de usuario de forma síncrona.
   */
  public get activeUserSession(): User {
    return this.theUser.value;
  }

  /**
   * Cierra la sesión del usuario, eliminando tanto la sesión final como la temporal.
   */
  logout() {
    localStorage.removeItem('sesion');
    localStorage.removeItem('temp-user');
    this.setUser(new User());
    this.router.navigate(['/login']);
  }
  
  /**
   * Al iniciar el servicio, verifica si ya existe una sesión válida en localStorage.
   */
  verifyActualSession() {
    let actualSesion = this.getSessionData();
    if (actualSesion) {
      this.setUser(JSON.parse(actualSesion));
    }
  }

  /**
   * Verifica si existe una sesión activa (con token).
   */
  existSession(): boolean {
    let sesionActual = this.getSessionData();
    return (sesionActual) ? true : false;
  }
  
  /**
   * Obtiene los datos de la sesión activa desde el local storage.
   */
  getSessionData() {
    let sesionActual = localStorage.getItem('sesion');
    return sesionActual;
  }

  /**
   * Obtiene únicamente el token de la sesión activa.
   * Esto es para que otros servicios puedan usarlo fácilmente.
   */
  getToken(): string | null {
    let sesionData = this.getSessionData();
    if (sesionData) {
      let userSession = JSON.parse(sesionData);
      return userSession.token;
    }
    return null;
  }

  // ... dentro de la clase SecurityService

  /**
   * Solicita una nueva contraseña para el correo proporcionado.
   */
  forgotPassword(email: string): Observable<any> {
    const url = `${environment.url_ms_security}/api/public/security/forgot-password`;
    return this.http.post<any>(url, { email });
  }
}