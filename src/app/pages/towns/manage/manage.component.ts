// src/app/pages/towns/manage/manage.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { Town } from '../../../models/town.model'; // Ajusta la ruta
import { TownService } from '../../../services/town.service'; // Ajusta la ruta
import { State } from '../../../models/state.model'; // Para el dropdown
import { StateService } from '../../../services/state.service'; // Para cargar estados

@Component({
  selector: 'app-town-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; // 1 - view, 2 - create, 3 - update
  theTown!: Town;
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  states: State[] = []; // Para el dropdown de estados

  constructor(
    private activateRoute: ActivatedRoute,
    private townService: TownService,
    private stateService: StateService, // Para cargar los estados
    private router: Router,
    private readonly theFormBuilder: FormBuilder
  ) {
    this.mode = 1; // Default
  }

  ngOnInit(): void {
    this.loadStatesForDropdown();
    this.configFormGroup();

    const currentUrl = this.activateRoute.snapshot.url.join('/');

    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
      this.theTown = { name: '', population: 0, state_id: undefined }; // Valores por defecto
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    if (this.activateRoute.snapshot.params.id) {
      const townId = Number(this.activateRoute.snapshot.params.id);
      this.getTown(townId);
    }
  }

  loadStatesForDropdown(): void {
    this.stateService.list().subscribe({ // Asumiendo que tu StateService tiene un método list()
      next: (data) => {
        this.states = data;
      },
      error: (err) => {
        console.error("Error loading states for dropdown", err);
        Swal.fire('Error', 'No se pudieron cargar los estados para la selección.', 'error');
      }
    });
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
          // 'unique' se valida en backend
        ]
      ],
      population: [
        null,
        [
          Validators.required,
          Validators.min(1),       // Basado en rules.range(1, ...)
          Validators.max(10000000), // Basado en rules.range(..., 10000000)
          Validators.pattern(/^[0-9]+$/) // Solo números enteros
        ]
      ],
      state_id: [
        null,
        [Validators.required]
        // 'exists' se valida en backend
      ]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getTown(id: number) {
    this.townService.view(id).subscribe({
      next: (data) => {
        this.theTown = data;
        this.theFormGroup.patchValue({
          name: this.theTown.name,
          population: this.theTown.population,
          state_id: this.theTown.state_id
        });
        if (this.mode === 1) {
          this.theFormGroup.disable();
        }
      },
      error: (error) => {
        console.error("Error fetching town", error);
        Swal.fire('Error', 'No se pudo cargar la ciudad.', 'error');
        this.router.navigate(['/towns/list']);
      }
    });
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

    const townToCreate: Town = {
      ...this.theFormGroup.value,
    };

    this.townService.create(townToCreate).subscribe({
      next: (data) => {
        Swal.fire('Creada', 'La ciudad ha sido creada exitosamente.', 'success');
        this.router.navigate(['/towns/list']);
      },
      error: (error) => {
        console.error("Error creating town", error);
        let errorMessage = 'Ocurrió un error al crear la ciudad.';
        if (error.error) {
          errorMessage = this.formatAdonisError(error.error);
        }
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid && this.mode === 3) {
         if (this.theFormGroup.invalid) {
            Swal.fire('Error de Validación', 'Por favor, revise los campos del formulario.', 'error');
            return;
         }
    }

    const townToUpdate: Town = {
      id: this.theTown.id,
      ...this.theFormGroup.value,
    };

    this.townService.update(townToUpdate).subscribe({
      next: (data) => {
        Swal.fire('Actualizada', 'La ciudad ha sido actualizada exitosamente.', 'success');
        this.router.navigate(['/towns/list']);
      },
      error: (error) => {
        console.error("Error updating town", error);
        let errorMessage = 'Ocurrió un error al actualizar la ciudad.';
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
    if (errorResponse.message && typeof errorResponse.message === 'string') {
      return errorResponse.message;
    }
    return 'Error desconocido del servidor.';
  }

  back() {
    this.router.navigate(['/towns/list']);
  }
}