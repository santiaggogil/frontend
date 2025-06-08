import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SecurityService } from 'src/app/services/security.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup = new FormGroup({});

  constructor(
    private fb: FormBuilder,
    private securityService: SecurityService,
    private Router: Router
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  getFormGroup() {
    return this.registerForm.controls;
  }

  register() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      this.securityService.register(formData).subscribe({
        next: (response) => {
          console.log('Usuario registrado:', response);
          this.Router.navigate(['/login']); // Redirige al login después del registro exitoso
        },
        error: (error) => {
          console.error('Error al registrar usuario:', error);
          // Aquí puedes mostrar un mensaje de error
        }
      });
    } else {
      console.warn('Formulario inválido');
    }
  }
}