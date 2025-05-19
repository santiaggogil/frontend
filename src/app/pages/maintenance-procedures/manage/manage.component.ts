import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { MaintenanceProcedure } from 'src/app/models/maintenance-procedure.model'; // Modelo actualizado
import { MaintenanceProcedureService } from 'src/app/services/maintenance-procedure.service'; // Servicio actualizado

@Component({
  selector: 'app-manage-maintenance-procedure', // Selector actualizado
  templateUrl: './manage.component.html', // Apunta al HTML correcto
  styleUrls: ['./manage.component.scss']
})
export class ManageMaintenanceProcedureComponent implements OnInit {

  mode: number = 1; // 1 - view, 2 - create, 3 - update
  maintenanceProcedure!: MaintenanceProcedure; // Modelo actualizado
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  currentId?: number;

  constructor(
    private activateRoute: ActivatedRoute,
    private maintenanceProcedureService: MaintenanceProcedureService, // Servicio actualizado
    private router: Router,
    private fb: FormBuilder
  ) {
    this.maintenanceProcedure = {} as MaintenanceProcedure; // Inicializar con el nuevo modelo
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
      this.currentId = +idFromRoute;
    }

    if ((this.mode === 1 || this.mode === 3) && this.currentId) {
      this.getMaintenanceProcedure(this.currentId);
    } else if (this.mode === 1 && !this.currentId) {
      Swal.fire('Error', 'No se especificó un ID para ver el procedimiento de mantenimiento.', 'error');
      this.router.navigate(['/maintenanceProcedures/list']); // Ruta base actualizada
    }
  }

  configFormGroup() {
    this.theFormGroup = this.fb.group({
      maintenance_id: [null, [Validators.required, Validators.min(1)]],
      procedure_id: [null, [Validators.required, Validators.min(1)]]
    });
  }

  getMaintenanceProcedure(id: number) { // Nombre de método actualizado
    this.maintenanceProcedureService.view(id).subscribe({
      next: (responseData) => {
        if (responseData) {
          this.maintenanceProcedure = responseData;

          this.theFormGroup.patchValue({
            maintenance_id: this.maintenanceProcedure.maintenance_id,
            procedure_id: this.maintenanceProcedure.procedure_id
          });

          if (this.mode === 1) {
            this.theFormGroup.disable();
          }
        } else {
          Swal.fire('No Encontrado', 'El procedimiento de mantenimiento solicitado no existe o no se pudo cargar.', 'warning');
          this.router.navigate(['/maintenanceProcedures/list']); // Ruta base actualizada
        }
      },
      error: (err) => {
        console.error("Error fetching maintenance procedure:", err);
        const errorMessage = err.error?.message || err.message || 'No se pudo cargar el procedimiento de mantenimiento.';
        Swal.fire('Error', errorMessage, 'error');
        this.router.navigate(['/maintenanceProcedures/list']); // Ruta base actualizada
      }
    });
  }

  get formControls() {
    return this.theFormGroup.controls;
  }

  back() {
    this.router.navigate(['/maintenanceProcedures/list']); // Ruta base actualizada
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

    const dataToCreate: MaintenanceProcedure = {
      // id no se envía en la creación
      maintenance_id: +this.theFormGroup.value.maintenance_id,
      procedure_id: +this.theFormGroup.value.procedure_id
    };

    this.maintenanceProcedureService.create(dataToCreate).subscribe({
      next: (response) => {
        // Como no hay 'description', usamos el ID o un mensaje genérico
        Swal.fire('Creado', `Procedimiento de Mantenimiento (ID: ${response.id}) creado correctamente.`, 'success');
        this.router.navigate(['/maintenanceProcedures/list']); // Ruta base actualizada
      },
      error: (err) => {
        console.error("Error creating maintenance procedure:", err);
        const errorMessage = err.error?.message || err.message || 'No se pudo crear el procedimiento de mantenimiento.';
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
    const dataToUpdate: MaintenanceProcedure = {
      id: this.maintenanceProcedure.id, // Crucial para la actualización
      maintenance_id: +formValues.maintenance_id,
      procedure_id: +formValues.procedure_id
    };

    this.maintenanceProcedureService.update(dataToUpdate).subscribe({
      next: (response) => {
        // Como no hay 'description', usamos el ID o un mensaje genérico
        Swal.fire('Actualizado', `Procedimiento de Mantenimiento (ID: ${response.id}) actualizado correctamente.`, 'success');
        this.router.navigate(['/maintenanceProcedures/list']); // Ruta base actualizada
      },
      error: (err) => {
        console.error("Error updating maintenance procedure:", err);
        const errorMessage = err.error?.message || err.message || 'No se pudo actualizar el procedimiento de mantenimiento.';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }
}
