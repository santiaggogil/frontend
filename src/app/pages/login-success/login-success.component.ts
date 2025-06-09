import { jwtDecode } from 'jwt-decode';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from 'src/app/services/security.service'; // ¡Asegúrate de que esta ruta a tu servicio es correcta!

@Component({
  selector: 'app-login-success',
  // La vista de este componente no es importante, solo es un paso intermedio.
  template: '<p>Procesando inicio de sesión, por favor espere...</p>',
  styleUrls: []
})
export class LoginSuccessComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private securityService: SecurityService // Tu servicio de seguridad que ya existe
  ) { }

  ngOnInit(): void {
    console.log("LOGIN-SUCCESS: ngOnInit ejecutado."); // Añade este log para confirmar
    this.route.queryParams.subscribe(params => {
      const token = params['token'];

      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          const dataSesion = {
            token: token,
            user: {
              _id: decodedToken.sub,
              name: decodedToken.name,
              email: decodedToken.email,
            }
          };

          this.securityService.saveSession(dataSesion);
          console.log("LOGIN-SUCCESS: Sesión guardada en localStorage.");


          this.router.navigate(['/dashboard']).then(navigated => {
            if (!navigated) {
              console.error('La navegación al dashboard falló.');
            }
          });
        } catch (error) {
          console.error("Error al procesar el token JWT de Google:", error);
          this.router.navigate(['/login']);
        }
      } else {
        // Si no se recibió token, algo falló en el backend
        console.error("Fallo en el login con Google: No se recibió un token.");
        this.router.navigate(['/login']);
      }
    });
  }
}