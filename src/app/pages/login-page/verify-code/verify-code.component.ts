// pages/login-page/verify-code/verify-code.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/services/security.service';
import Swal from 'sweetalert2';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss']
})
export class VerifyCodeComponent implements OnInit {

  code: number;
  user: User | null;

  constructor(
    private securityService: SecurityService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Obtenemos los datos del usuario de la sesión temporal guardada.
    this.user = this.securityService.getTemporarySession();

    // Si no hay sesión temporal, es un acceso inválido, lo redirigimos al login.
    if (!this.user) {
      Swal.fire("Acceso Inválido", "Por favor, inicia sesión primero.", "error");
      this.router.navigate(['/login']);
    }
  }

  /**
   * Llama al servicio para verificar el código 2FA.
   */
  verify() {
    if (!this.user || !this.user._id) {
      Swal.fire("Error de Sesión", "No se pudo identificar al usuario. Por favor, vuelve a iniciar sesión.", "error");
      this.router.navigate(['/login']);
      return;
    }

    this.securityService.verifyCode(this.user._id, this.code).subscribe({
      next: (data) => {
        // El servicio ya guardó la sesión con el token gracias al operador 'tap'.
        // Solo necesitamos redirigir al dashboard.
        this.router.navigate(["/dashboard"]); // O la ruta a tu panel principal
      },
      error: (error) => {
        console.error(error);
        Swal.fire("Error de Verificación", "El código ingresado es incorrecto o ha expirado.", "error");
      }
    });
  }
  
  /**
   * Permite al usuario volver a la pantalla de login.
   */
  goBackToLogin() {
    this.router.navigate(['/login']);
  }
}