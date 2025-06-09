import { Component } from '@angular/core';
import { SecurityService } from 'src/app/services/security.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(private securityService: SecurityService) {}

  requestNewPassword() {
    if (!this.email) return;
    this.securityService.forgotPassword(this.email).subscribe({
      next: (response) => {
        Swal.fire('Petición Enviada', response.message, 'success');
      },
      error: (err) => {
        Swal.fire('Error', 'Ocurrió un problema, por favor intenta de nuevo.', 'error');
      }
    });
  }
}