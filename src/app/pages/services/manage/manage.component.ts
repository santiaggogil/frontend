// src/app/components/services/manage/manage.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DateTime } from 'luxon';

import { Service } from '../../../models/service.model'; // Ajusta la ruta
import { ServiceService } from '../../../services/service.service'; // Ajusta la ruta

@Component({
  selector: 'app-service-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; // 1 - view, 2 - create, 3 - update
  service!: Service; // Usar 'definite assignment assertion' si se inicializa en constructor/ngOnInit
  theFormGroup!: FormGroup; // Usar 'definite assignment assertion'
  trySend: boolean = false;

  constructor(
    private activateRoute: ActivatedRoute,
    private serviceService: ServiceService, 
    private router: Router,
    private readonly theFormBuilder: FormBuilder
  ) {
    // Inicialización movida a ngOnInit o al obtener datos para claridad
    this.mode = 1; // Default to view mode
  }

  ngOnInit(): void {
    this.configFormGroup(); // Configurar el formulario primero

    const currentUrl = this.activateRoute.snapshot.url.join('/');

    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
      // Para el modo creación, inicializamos un objeto 'service' vacío
      this.service = { name: '', cost: 0, start_date: '', end_date: '', description: '' };
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    if (this.activateRoute.snapshot.params.id) {
      const serviceId = Number(this.activateRoute.snapshot.params.id);
      this.getService(serviceId);
    } else if (this.mode === 2) {
      // Ya inicializado arriba si es 'create'
    }
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
        ]
      ],
      cost: [
        null,
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)
        ]
      ],
      start_date: [
        null,
        [Validators.required]
      ],
      end_date: [
        null,
        [Validators.required]
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500)
        ]
      ]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getService(id: number) {
    this.serviceService.view(id).subscribe({
      next: (data) => {
        this.service = data;
        this.theFormGroup.patchValue({
          name: this.service.name,
          cost: this.service.cost,
          start_date: this.service.start_date ? DateTime.fromSQL(this.service.start_date).toFormat("yyyy-MM-dd'T'HH:mm") : null,
          end_date: this.service.end_date ? DateTime.fromSQL(this.service.end_date).toFormat("yyyy-MM-dd'T'HH:mm") : null,
          description: this.service.description
        });
        if (this.mode === 1) {
            this.theFormGroup.disable();
        }
      },
      error: (error) => {
        console.error("Error fetching service", error);
        Swal.fire('Error', 'No se pudo cargar el servicio.', 'error');
        this.router.navigate(['/services/list']);
      }
    });
  }

  private formatDateTimeForBackend(isoDateTimeString: string | null | undefined): string | null {
    if (!isoDateTimeString) return null;
    try {
      return DateTime.fromISO(isoDateTimeString).toFormat('yyyy-MM-dd HH:mm:ss');
    } catch (e) {
      console.error("Error formatting date for backend:", e, "Input was:", isoDateTimeString);
      return null;
    }
  }

  onSubmit(): void {
    if (this.mode === 2) {
      this.create();
    } else if (this.mode === 3) {
      this.update();
    }
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error de Validación', 'Por favor, complete todos los campos requeridos correctamente.', 'error');
      return;
    }

    const formValues = this.theFormGroup.value;
    const startDate = DateTime.fromISO(formValues.start_date);
    const endDate = DateTime.fromISO(formValues.end_date);

    if (!startDate.isValid || !endDate.isValid) {
        Swal.fire('Error de Fechas', 'Las fechas ingresadas no son válidas.', 'error');
        return;
    }

    if (endDate <= startDate) {
      Swal.fire('Error de Fechas', 'La fecha de fin debe ser posterior a la fecha de inicio.', 'error');
      return;
    }

    const serviceToCreate: Service = {
      ...formValues,
      start_date: this.formatDateTimeForBackend(formValues.start_date)!,
      end_date: this.formatDateTimeForBackend(formValues.end_date)!,
    };

    this.serviceService.create(serviceToCreate).subscribe({
      next: (data) => {
        Swal.fire('Creado', 'El servicio ha sido creado exitosamente.', 'success');
        this.router.navigate(['/services/list']);
      },
      error: (error) => {
        console.error("Error creating service", error);
        let errorMessage = 'Ocurrió un error al crear el servicio.';
        if (error.error) {
            errorMessage = this.formatAdonisError(error.error);
        }
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error de Validación', 'Por favor, complete todos los campos requeridos correctamente.', 'error');
      return;
    }

    const formValues = this.theFormGroup.value;
    const startDate = DateTime.fromISO(formValues.start_date);
    const endDate = DateTime.fromISO(formValues.end_date);

    if (!startDate.isValid || !endDate.isValid) {
        Swal.fire('Error de Fechas', 'Las fechas ingresadas no son válidas.', 'error');
        return;
    }

    if (endDate <= startDate) {
      Swal.fire('Error de Fechas', 'La fecha de fin debe ser posterior a la fecha de inicio.', 'error');
      return;
    }

    const serviceToUpdate: Service = {
      id: this.service.id,
      ...formValues,
      start_date: this.formatDateTimeForBackend(formValues.start_date)!,
      end_date: this.formatDateTimeForBackend(formValues.end_date)!,
    };

    this.serviceService.update(serviceToUpdate).subscribe({
      next: (data) => {
        Swal.fire('Actualizado', 'El servicio ha sido actualizado exitosamente.', 'success');
        this.router.navigate(['/services/list']);
      },
      error: (error) => {
        console.error("Error updating service", error);
        let errorMessage = 'Ocurrió un error al actualizar el servicio.';
        if (error.error) {
            errorMessage = this.formatAdonisError(error.error);
        }
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  private formatAdonisError(errorResponse: any): string {
    if (errorResponse.errors && Array.isArray(errorResponse.errors) && errorResponse.errors.length > 0) {
        return errorResponse.errors.map((err: any) => err.message).join('<br>');
    }
    if(errorResponse.message && typeof errorResponse.message === 'string'){
        return errorResponse.message;
    }
    return 'Error desconocido del servidor.';
  }

  back() {
    this.router.navigate(['/services/list']);
  }
}