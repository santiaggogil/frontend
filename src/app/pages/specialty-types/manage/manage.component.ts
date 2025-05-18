import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { SpecialtyType } from 'src/app/models/specialty-type.model'; // CAMBIO: Importa tu modelo
import { SpecialtyTypeService } from 'src/app/services/specialty-type.service'; // CAMBIO: Importa tu servicio
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-specialty-type-manage', // CAMBIO: Selector del componente
  templateUrl: './manage.component.html', // Ajusta si tu HTML tiene otro nombre
  styleUrls: ['./manage.component.scss'], // Ajusta si tu SCSS tiene otro nombre
  providers: [CurrencyPipe, DatePipe]
})
export class ManageSpecialtyTypeComponent implements OnInit { // CAMBIO: Nombre de la clase

  mode: number = 1; // 1 - view, 2 - create, 3 - update
  specialtyType!: SpecialtyType; // CAMBIO: Tipo y nombre de la variable
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  currentId?: number;

  constructor(
    private activateRoute: ActivatedRoute,
    private specialtyTypeService: SpecialtyTypeService, // CAMBIO: Inyección del servicio
    private router: Router,
    private fb: FormBuilder
  ) {
    this.specialtyType = {} as SpecialtyType; // CAMBIO: Inicializa con tu modelo
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
      this.getSpecialtyType(this.currentId); // CAMBIO: Llama al método renombrado
    } else if (this.mode === 1 && this.theFormGroup) {
        this.theFormGroup.disable();
    }
  }

  configFormGroup() {
    this.theFormGroup = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(100)]],
      description: [null, [Validators.maxLength(500)]],
      machine_id: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]], // CAMBIO: Nuevo campo
      service_type_id: [null, [Validators.required, Validators.pattern(/^[0-9]+$/)]] // CAMBIO: Nuevo campo
    });
  }

  getSpecialtyType(id: number) { // CAMBIO: Nombre del método
    this.specialtyTypeService.view(id).subscribe({ // CAMBIO: Usa el servicio de especialidades
      next: (data) => {
        if (data) {
          this.specialtyType = data; // CAMBIO: Asigna a la variable de especialidades
          this.theFormGroup.patchValue({
            name: this.specialtyType.name,
            description: this.specialtyType.description,
            machine_id: this.specialtyType.machine_id, // CAMBIO: Nuevo campo
            service_type_id: this.specialtyType.service_type_id // CAMBIO: Nuevo campo
          });

          if (this.mode === 1) {
            this.theFormGroup.disable();
          }
        } else {
          Swal.fire('Error', 'La respuesta del servidor no tiene el formato esperado para la especialidad.', 'error'); // CAMBIO: Mensaje
          this.router.navigate(['/SpecialtyTypes/list']); // CAMBIO: Ruta
        }
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo cargar la especialidad.'; // CAMBIO: Mensaje
        Swal.fire('Error', errorMessage, 'error');
        this.router.navigate(['/specialtyTypes/list']); // CAMBIO: Ruta
      }
    });
  }

  get formControls() {
    return this.theFormGroup.controls;
  }

  back() {
    this.router.navigate(['/specialtyTypes/list']); // CAMBIO: Ruta
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

    const dataToCreate: SpecialtyType = { // CAMBIO: Tipo de dato
      ...this.theFormGroup.value, // Incluye name, description, machine_id, service_type_id
    };

    this.specialtyTypeService.create(dataToCreate).subscribe({ // CAMBIO: Usa el servicio de especialidades
      next: () => {
        Swal.fire('Creada', "Especialidad creada correctamente.", 'success'); // CAMBIO: Mensaje
        this.router.navigate(['/specialtyTypes/list']); // CAMBIO: Ruta
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo crear la especialidad.'; // CAMBIO: Mensaje
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
    const dataToUpdate: SpecialtyType = { // CAMBIO: Tipo de dato
      id: this.specialtyType.id,
      name: formValues.name,
      description: formValues.description,
      machine_id: formValues.machine_id, // CAMBIO: Nuevo campo
      service_type_id: formValues.service_type_id, // CAMBIO: Nuevo campo
    };

    this.specialtyTypeService.update(dataToUpdate).subscribe({ // CAMBIO: Usa el servicio de especialidades
      next: () => {
        Swal.fire('Actualizada', "Especialidad actualizada correctamente.", 'success'); // CAMBIO: Mensaje
        this.router.navigate(['/SpecialtyTypes/list']); // CAMBIO: Ruta
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo actualizar la especialidad.'; // CAMBIO: Mensaje
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }
}
