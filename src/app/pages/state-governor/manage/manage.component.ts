// src/app/pages/state-governor/manage/manage.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DateTime } from 'luxon';

import { StateGovernor } from '../../../models/state-governor.model'; // Ajusta la ruta
import { StateGovernorService } from '../../../services/state-governor.service'; // Ajusta la ruta
import { State } from '../../../models/state.model'; // Para el dropdown
import { StateService } from '../../../services/state.service'; // Para cargar estados
import { Governor } from '../../../models/governor.model'; // Para el dropdown
import { GovernorService } from '../../../services/governor.service'; // Para cargar gobernadores

@Component({
  selector: 'app-state-governor-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number = 1;
  theStateGovernor!: StateGovernor;
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  states: State[] = [];
  governors: Governor[] = [];

  constructor(
    private activateRoute: ActivatedRoute,
    private stateGovernorService: StateGovernorService,
    private stateService: StateService,
    private governorService: GovernorService,
    private router: Router,
    private readonly theFormBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.configFormGroup();
    this.loadStatesForDropdown();
    this.loadGovernorsForDropdown();

    const currentUrl = this.activateRoute.snapshot.url.join('/');

    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
      this.theStateGovernor = { state_id: undefined, governor_id: undefined }; // Valores iniciales
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    if (this.activateRoute.snapshot.params.id) {
      const stateGovernorId = Number(this.activateRoute.snapshot.params.id);
      this.getStateGovernor(stateGovernorId);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      start_date: [null, [Validators.required]], // Para input type="date"
      end_date: [null, [Validators.required]],   // Para input type="date"
      state_id: [null, [Validators.required]],
      governor_id: [null, [Validators.required]]
    });
  }

  loadStatesForDropdown(): void {
    this.stateService.list().subscribe({
      next: (data) => this.states = data,
      error: (err) => {
        console.error("Error loading states", err);
        Swal.fire('Error', 'No se pudieron cargar los estados.', 'error');
      }
    });
  }

  loadGovernorsForDropdown(): void {
    this.governorService.list().subscribe({
      next: (data) => this.governors = data,
      error: (err) => {
        console.error("Error loading governors", err);
        Swal.fire('Error', 'No se pudieron cargar los gobernadores.', 'error');
      }
    });
  }

  get fg() {
    return this.theFormGroup.controls;
  }

  getStateGovernor(id: number) {
    this.stateGovernorService.view(id).subscribe({
      next: (data) => {
        this.theStateGovernor = data;
        this.theFormGroup.patchValue({
          start_date: this.theStateGovernor.start_date ? DateTime.fromISO(this.theStateGovernor.start_date).toFormat('yyyy-MM-dd') : null,
          end_date: this.theStateGovernor.end_date ? DateTime.fromISO(this.theStateGovernor.end_date).toFormat('yyyy-MM-dd') : null,
          state_id: this.theStateGovernor.state_id,
          governor_id: this.theStateGovernor.governor_id
        });
        if (this.mode === 1) {
          this.theFormGroup.disable();
        }
      },
      error: (error) => {
        console.error("Error fetching state-governor relation", error);
        Swal.fire('Error', 'No se pudo cargar la relación estado-gobernador.', 'error');
        this.router.navigate(['/state-governor/list']); // Ruta en singular
      }
    });
  }

  private formatDateForBackend(inputDate: string | null | undefined): string | null {
    if (!inputDate) return null;
    try {
      return DateTime.fromISO(inputDate).toFormat('yyyy-MM-dd');
    } catch (e) {
      console.error("Error formatting date for backend:", e, "Input was:", inputDate);
      return null;
    }
  }

  onSubmit(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error de Validación', 'Por favor, complete todos los campos requeridos correctamente.', 'error');
      Object.values(this.theFormGroup.controls).forEach(control => control.markAsTouched());
      return;
    }

    const startDate = DateTime.fromISO(this.theFormGroup.value.start_date);
    const endDate = DateTime.fromISO(this.theFormGroup.value.end_date);
    const today = DateTime.now().startOf('day');

    // Validar start_date según el modo y las reglas de Adonis
    if (this.mode === 2 && startDate >= today) { // Crear: before('today')
        Swal.fire('Error en Fecha de Inicio', 'La fecha de inicio debe ser anterior al día actual.', 'error');
        return;
    }
    // Para update, el validador de Adonis también tiene before('today').
    // Se aplica si la fecha fue modificada.
    if (this.mode === 3 && this.fg.start_date.dirty && startDate >= today) {
        Swal.fire('Error en Fecha de Inicio', 'La fecha de inicio (si se modifica) debe ser anterior al día actual.', 'error');
        return;
    }

    if (endDate <= startDate) {
      Swal.fire('Error de Fechas', 'La fecha de finalización debe ser posterior a la fecha de inicio.', 'error');
      return;
    }

    if (this.mode === 2) {
      this.create();
    } else if (this.mode === 3) {
      this.update();
    }
  }

  create() {
    const stateGovernorToCreate: StateGovernor = {
      ...this.theFormGroup.value,
      start_date: this.formatDateForBackend(this.theFormGroup.value.start_date)!,
      end_date: this.formatDateForBackend(this.theFormGroup.value.end_date)!,
    };

    this.stateGovernorService.create(stateGovernorToCreate).subscribe({
      next: (data) => {
        Swal.fire('Creado', 'La relación estado-gobernador ha sido creada exitosamente.', 'success');
        this.router.navigate(['/state-governor/list']); // Ruta en singular
      },
      error: (error) => {
        console.error("Error creating state-governor relation", error);
        this.handleApiError(error, 'Ocurrió un error al crear la relación.');
      }
    });
  }

  update() {
    const stateGovernorToUpdate: StateGovernor = {
      id: this.theStateGovernor.id,
      ...this.theFormGroup.value,
      start_date: this.formatDateForBackend(this.theFormGroup.value.start_date)!,
      end_date: this.formatDateForBackend(this.theFormGroup.value.end_date)!,
    };

    this.stateGovernorService.update(stateGovernorToUpdate).subscribe({
      next: (data) => {
        Swal.fire('Actualizado', 'La relación estado-gobernador ha sido actualizada exitosamente.', 'success');
        this.router.navigate(['/state-governor/list']); // Ruta en singular
      },
      error: (error) => {
        console.error("Error updating state-governor relation", error);
        this.handleApiError(error, 'Ocurrió un error al actualizar la relación.');
      }
    });
  }

  private handleApiError(error: any, defaultMessage: string): void {
    let errorMessage = defaultMessage;
    if (error.error && error.error.message) {
        errorMessage = error.error.message;
    } else if (error.error && error.error.errors && Array.isArray(error.error.errors) && error.error.errors.length > 0) {
        errorMessage = error.error.errors.map((err: any) => err.message).join('<br>');
    }
    Swal.fire('Error', errorMessage, 'error');
  }

  back() {
    this.router.navigate(['/state-governor/list']); // Ruta en singular
  }
}