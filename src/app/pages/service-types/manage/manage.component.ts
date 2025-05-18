import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { ServiceType } from 'src/app/models/service-type.model';
import { ServiceTypeService } from 'src/app/services/service-type.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-service-type-list', // CAMBIO: Selector
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
  providers: [CurrencyPipe, DatePipe]
})
export class ManageServiceTypeComponent implements OnInit {

  mode: number = 1; // 1 - view, 2 - create, 3 - update
  serviceType!: ServiceType;
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  currentId?: number;

  constructor(
    private activateRoute: ActivatedRoute,
    private serviceTypeService: ServiceTypeService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.serviceType = {} as ServiceType;
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
      this.currentId = +idFromRoute; // El '+' convierte a número
    }

    if ((this.mode === 1 || this.mode === 3) && this.currentId) {
      this.getServiceType(this.currentId);
    } else if (this.mode === 1 && this.theFormGroup) { // Si es modo vista y no hay ID (aunque no debería pasar si la ruta está bien)
        this.theFormGroup.disable();
    }
  }

  configFormGroup() {
    this.theFormGroup = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(100)]],
      description: [null, [Validators.maxLength(500)]] // Puedes añadir Validators.required si es necesario
    });
  }

  getServiceType(id: number) {
    this.serviceTypeService.view(id).subscribe({
      next: (data) => {
        if (data) {
          this.serviceType = data;
          this.theFormGroup.patchValue({
            name: this.serviceType.name,
            description: this.serviceType.description
          });

          if (this.mode === 1) {
            this.theFormGroup.disable();
          }
        } else {
          Swal.fire('Error', 'La respuesta del servidor no tiene el formato esperado para el tipo de servicio.', 'error');
          this.router.navigate(['/serviceTypes/list']); // AJUSTA ESTA RUTA
        }
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo cargar el tipo de servicio.';
        Swal.fire('Error', errorMessage, 'error');
        this.router.navigate(['/serviceTypes/list']); // AJUSTA ESTA RUTA
      }
    });
  }

  get formControls() {
    return this.theFormGroup.controls;
  }

  back() {
    this.router.navigate(['/serviceTypes/list']); // AJUSTA ESTA RUTA
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos requeridos correctamente.', 'error');
      Object.values(this.formControls).forEach(control => {
        if (control.enabled) control.markAsTouched();
      });
      return;
    }

    const dataToCreate: ServiceType = {
      ...this.theFormGroup.value,
    };

    this.serviceTypeService.create(dataToCreate).subscribe({
      next: () => {
        Swal.fire('Creado', "Tipo de servicio creado correctamente.", 'success');
        this.router.navigate(['/serviceTypes/list']); // AJUSTA ESTA RUTA
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo crear el tipo de servicio.';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  update() {
    this.trySend = true;
    let formIsValid = true;
    Object.keys(this.formControls).forEach(key => {
      const control = this.formControls[key];
      if (control.enabled && control.invalid) {
        formIsValid = false;
        control.markAsTouched();
      }
    });

    if (!formIsValid) {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos editables requeridos correctamente.', 'error');
      return;
    }

    const formValues = this.theFormGroup.getRawValue();
    const dataToUpdate: ServiceType = {
      id: this.serviceType.id,
      name: formValues.name,
      description: formValues.description,
    };

    this.serviceTypeService.update(dataToUpdate).subscribe({
      next: () => {
        Swal.fire('Actualizado', "Tipo de servicio actualizado correctamente.", 'success');
        this.router.navigate(['/serviceTypes/list']); // AJUSTA ESTA RUTA
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo actualizar el tipo de servicio.';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }
}
