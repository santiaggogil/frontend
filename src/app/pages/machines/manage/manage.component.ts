// src/app/components/machines/manage/manage.component.ts (ejemplo de ruta)
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { Machine } from 'src/app/models/machine.model';
import { MachineService } from 'src/app/services/machine.service';

@Component({
  selector: 'app-manage-machine', // Selector actualizado
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageMachineComponent implements OnInit { // Nombre de clase actualizado

  mode: number = 1; // 1 - view, 2 - create, 3 - update
  machine!: Machine;
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  currentId?: number;

  constructor(
    private activateRoute: ActivatedRoute,
    private machineService: MachineService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.machine = {} as Machine; // Inicializar
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
      this.getMachine(this.currentId);
    } else if (this.mode === 1) {
      if (this.theFormGroup) this.theFormGroup.disable();
    }
  }

  configFormGroup() {
    const currentYear = new Date().getFullYear();
    this.theFormGroup = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      model: ['', [Validators.required, Validators.maxLength(100)]],
      brand: ['', [Validators.required, Validators.maxLength(100)]],
      year: [null, [
          Validators.required,
          Validators.min(1900), // Año mínimo razonable
          Validators.max(currentYear + 5), // Año máximo razonable (actual + 5)
          Validators.pattern(/^\d{4}$/) // Debe ser un número de 4 dígitos
        ]
      ]
    });
  }

  getMachine(id: number) {
    this.machineService.view(id).subscribe({
      next: (responseData) => {
        const data = responseData; // Asumiendo respuesta directa del servicio

        if (data) {
          this.machine = data;
          this.theFormGroup.patchValue({
            name: this.machine.name,
            model: this.machine.model,
            brand: this.machine.brand,
            year: this.machine.year
          });

          if (this.mode === 1) {
            this.theFormGroup.disable();
          }
        } else {
          Swal.fire('Error', 'La respuesta del servidor no tiene el formato esperado para la máquina.', 'error');
          this.router.navigate(['/machines/list']);
        }
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo cargar la máquina.';
        Swal.fire('Error', errorMessage, 'error');
        this.router.navigate(['/machines/list']);
      }
    });
  }

  get formControls() {
    return this.theFormGroup.controls;
  }

  back() {
    this.router.navigate(['/machines/list']);
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos requeridos correctamente.', 'error');
      Object.values(this.formControls).forEach(control => control.markAsTouched());
      return;
    }

    const formValues = this.theFormGroup.value;
    const dataToCreate: Machine = {
      // id es generado por el backend, no se envía desde el form
      name: formValues.name,
      model: formValues.model,
      brand: formValues.brand,
      year: +formValues.year // Asegurar que year sea número
    };

    this.machineService.create(dataToCreate).subscribe({
      next: () => {
        Swal.fire('Creada', "Máquina creada correctamente.", 'success');
        this.router.navigate(['/machines/list']);
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo crear la máquina.';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos editables requeridos correctamente.', 'error');
      Object.values(this.formControls).forEach(control => control.markAsTouched());
      return;
    }

    const formValues = this.theFormGroup.value;
    const dataToUpdate: Machine = {
      id: this.machine.id, // El ID viene del objeto cargado
      name: formValues.name,
      model: formValues.model,
      brand: formValues.brand,
      year: +formValues.year // Asegurar que year sea número
    };

    this.machineService.update(dataToUpdate).subscribe({
      next: () => {
        Swal.fire('Actualizada', "Máquina actualizada correctamente.", 'success');
        this.router.navigate(['/machines/list']);
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo actualizar la máquina.';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }
}
