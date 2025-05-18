import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // AbstractControl no es necesario importar directamente aquí
import Swal from 'sweetalert2';

import { Maintenance } from 'src/app/models/maintenance.model';
import { MaintenanceService } from 'src/app/services/maintenance.service';

@Component({
  selector: 'app-manage-new', // Selector actualizado
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'] // Puedes usar el mismo SCSS o uno específico
})
export class ManageMaintenanceComponent implements OnInit {

  mode: number = 1; // 1 - view, 2 - create, 3 - update
  maintenance!: Maintenance;
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  currentId?: number;

  constructor(
    private activateRoute: ActivatedRoute,
    private maintenanceService: MaintenanceService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.maintenance = {} as Maintenance; // Inicializar para evitar errores de undefined
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
      this.getMaintenance(this.currentId);
    } else if (this.mode === 2) {
      // Modo creación: El formulario está listo para ser llenado
      // No es necesario hacer nada más aquí si no hay valores por defecto dinámicos
    } else if (this.mode === 1 && !this.currentId) {
      // Modo vista sin ID (debería ser manejado por el enrutador o redirigido)
      Swal.fire('Error', 'No se especificó un ID para ver el mantenimiento.', 'error');
      this.router.navigate(['/maintenances/list']);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.fb.group({
      description: [null, [Validators.required, Validators.maxLength(255)]],
      machine_id: [null, [Validators.required, Validators.min(1)]],
      cost: [null, [Validators.required, Validators.min(0)]],
      // Para el input type="date", el valor inicial puede ser '' o null.
      // Angular maneja la conversión a 'YYYY-MM-DD'
      date: ['', [Validators.required]]
    });
  }

  getMaintenance(id: number) {
    this.maintenanceService.view(id).subscribe({ // Usar el método 'view' del servicio
      next: (responseData) => {
        if (responseData) {
          this.maintenance = responseData;

          // Formatear la fecha para el input type="date" que espera 'YYYY-MM-DD'
          // responseData.date es string. Si ya es 'YYYY-MM-DD', no hay problema.
          // Si es ISO string completo (con 'T'), se formatea.
          let formattedDate = '';
          if (responseData.date) {
            if (responseData.date.includes('T')) {
              formattedDate = new Date(responseData.date).toISOString().split('T')[0];
            } else {
              formattedDate = responseData.date; // Asumir que ya es YYYY-MM-DD
            }
          }

          this.theFormGroup.patchValue({
            description: this.maintenance.description,
            machine_id: this.maintenance.machine_id,
            cost: this.maintenance.cost,
            date: formattedDate
          });

          if (this.mode === 1) {
            this.theFormGroup.disable();
          }
          // No es necesario deshabilitar campos específicos en modo update a menos que haya una lógica de negocio para ello
        } else {
          Swal.fire('No Encontrado', 'El mantenimiento solicitado no existe o no se pudo cargar.', 'warning');
          this.router.navigate(['/maintenances/list']);
        }
      },
      error: (err) => {
        console.error("Error fetching maintenance:", err);
        const errorMessage = err.error?.message || err.message || 'No se pudo cargar el mantenimiento.';
        Swal.fire('Error', errorMessage, 'error');
        this.router.navigate(['/maintenances/list']);
      }
    });
  }

  get formControls() {
    return this.theFormGroup.controls;
  }

  back() {
    this.router.navigate(['/maintenances/list']);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) { // Para grupos anidados, si los hubiera
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

    const dataToCreate: Maintenance = {
      // id no se envía en la creación
      description: this.theFormGroup.value.description,
      machine_id: +this.theFormGroup.value.machine_id,
      cost: +this.theFormGroup.value.cost,
      date: this.theFormGroup.value.date // El input type="date" ya provee 'YYYY-MM-DD'
    };

    this.maintenanceService.create(dataToCreate).subscribe({
      next: (response) => {
        Swal.fire('Creado', `Mantenimiento "${response.description || ''}" creado correctamente.`, 'success');
        this.router.navigate(['/maintenances/list']);
      },
      error: (err) => {
        console.error("Error creating maintenance:", err);
        const errorMessage = err.error?.message || err.message || 'No se pudo crear el mantenimiento.';
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

    // getRawValue() para incluir campos deshabilitados si fuera necesario, aunque aquí todos son editables.
    const formValues = this.theFormGroup.getRawValue();
    const dataToUpdate: Maintenance = {
      id: this.maintenance.id, // Crucial para la actualización
      description: formValues.description,
      machine_id: +formValues.machine_id,
      cost: +formValues.cost,
      date: formValues.date
    };

    // El servicio update(theMaintenances:Maintenance) espera el objeto completo
    this.maintenanceService.update(dataToUpdate).subscribe({
      next: (response) => {
        Swal.fire('Actualizado', `Mantenimiento "${response.description || ''}" actualizado correctamente.`, 'success');
        this.router.navigate(['/maintenances/list']);
      },
      error: (err) => {
        console.error("Error updating maintenance:", err);
        const errorMessage = err.error?.message || err.message || 'No se pudo actualizar el mantenimiento.';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }
}
