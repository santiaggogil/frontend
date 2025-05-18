import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { Procedure } from 'src/app/models/procedure.model'; // Asegúrate que la ruta sea correcta
import { ProcedureService } from 'src/app/services/procedure.service'; // Ajusta la ruta y el nombre del servicio

@Component({
  selector: 'app-manage-procedure', // Selector actualizado para procedimientos
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'] // Puedes usar el mismo SCSS o uno específico
})
export class ManageProcedureComponent implements OnInit {

  mode: number = 1; // 1 - view, 2 - create, 3 - update
  procedure!: Procedure;
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  currentId?: number;

  constructor(
    private activateRoute: ActivatedRoute,
    private procedureService: ProcedureService, // Servicio para Procedure
    private router: Router,
    private fb: FormBuilder
  ) {
    this.procedure = {} as Procedure; // Inicializar para evitar errores de undefined
    this.configFormGroup();
  }

  ngOnInit(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    const idFromRoute = this.activateRoute.snapshot.params['id'];
    if (idFromRoute) {
      this.currentId = +idFromRoute; // Convertir a número
    }

    if ((this.mode === 1 || this.mode === 3) && this.currentId) {
      this.getProcedure(this.currentId);
    } else if (this.mode === 2) {
      // Modo creación: El formulario está listo.
    } else if (this.mode === 1 && !this.currentId) {
      Swal.fire('Error', 'No se especificó un ID para ver el procedimiento.', 'error');
      this.router.navigate(['/procedures/list']); // Ajusta la ruta base
    }
  }

  configFormGroup() {
    this.theFormGroup = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(100)]], // Ajusta maxLength según necesites
      description: [null, [Validators.maxLength(255)]] // La descripción es opcional en el modelo, puedes añadir Validators.required si lo deseas aquí
      // Si la descripción DEBE ser requerida en el form, añade Validators.required:
      // description: [null, [Validators.required, Validators.maxLength(255)]]
    });
  }

  getProcedure(id: number) {
    this.procedureService.view(id).subscribe({ // Usar el método 'view' del servicio de procedure
      next: (responseData) => {
        if (responseData) {
          this.procedure = responseData;

          this.theFormGroup.patchValue({
            name: this.procedure.name,
            description: this.procedure.description
          });

          if (this.mode === 1) {
            this.theFormGroup.disable();
          }
        } else {
          Swal.fire('No Encontrado', 'El procedimiento solicitado no existe o no se pudo cargar.', 'warning');
          this.router.navigate(['/procedures/list']); // Ajusta la ruta base
        }
      },
      error: (err) => {
        console.error("Error fetching procedure:", err);
        const errorMessage = err.error?.message || err.message || 'No se pudo cargar el procedimiento.';
        Swal.fire('Error', errorMessage, 'error');
        this.router.navigate(['/procedures/list']); // Ajusta la ruta base
      }
    });
  }

  get formControls() {
    return this.theFormGroup.controls;
  }

  back() {
    this.router.navigate(['/procedures/list']); // Ajusta la ruta base
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
          this.markFormGroupTouched(control);
      }
    });
  }

  create() {
    this.trySend = true;
    this.markFormGroupTouched(this.theFormGroup);

    if (this.theFormGroup.invalid) {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos requeridos correctamente.', 'error');
      return;
    }

    const dataToCreate: Procedure = {
      // id no se envía en la creación
      name: this.theFormGroup.value.name,
      description: this.theFormGroup.value.description
    };

    this.procedureService.create(dataToCreate).subscribe({
      next: (response) => {
        Swal.fire('Creado', `Procedimiento "${response.name || ''}" creado correctamente.`, 'success');
        this.router.navigate(['/procedures/list']); // Ajusta la ruta base
      },
      error: (err) => {
        console.error("Error creating procedure:", err);
        const errorMessage = err.error?.message || err.message || 'No se pudo crear el procedimiento.';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  update() {
    this.trySend = true;
    this.markFormGroupTouched(this.theFormGroup);

    if (this.theFormGroup.invalid) {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos editables requeridos correctamente.', 'error');
      return;
    }

    const formValues = this.theFormGroup.getRawValue();
    const dataToUpdate: Procedure = {
      id: this.procedure.id, // Crucial para la actualización
      name: formValues.name,
      description: formValues.description
    };

    this.procedureService.update(dataToUpdate).subscribe({
      next: (response) => {
        Swal.fire('Actualizado', `Procedimiento "${response.name || ''}" actualizado correctamente.`, 'success');
        this.router.navigate(['/procedures/list']); // Ajusta la ruta base
      },
      error: (err) => {
        console.error("Error updating procedure:", err);
        const errorMessage = err.error?.message || err.message || 'No se pudo actualizar el procedimiento.';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }
}
