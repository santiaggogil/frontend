// src/app/pages/mayor-town/manage/manage.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DateTime } from 'luxon';

import { MayorTown } from '../../../models/mayor-town.model'; // Ajusta la ruta
import { MayorTownService } from '../../../services/mayor-town.service'; // Ajusta la ruta
import { Mayor } from '../../../models/mayor.model'; // Para el dropdown
import { MayorService } from '../../../services/mayor.service'; // Para cargar alcaldes
import { Town } from '../../../models/town.model'; // Para el dropdown
import { TownService } from '../../../services/town.service'; // Para cargar ciudades

@Component({
  selector: 'app-mayor-town-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number = 1;
  theMayorTown!: MayorTown;
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  mayors: Mayor[] = [];
  towns: Town[] = [];

  constructor(
    private activateRoute: ActivatedRoute,
    private mayorTownService: MayorTownService,
    private mayorService: MayorService,
    private townService: TownService,
    private router: Router,
    private readonly theFormBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.configFormGroup();
    this.loadMayorsForDropdown();
    this.loadTownsForDropdown();

    const currentUrl = this.activateRoute.snapshot.url.join('/');

    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
      this.theMayorTown = { mayor_id: undefined, town_id: undefined }; // Valores iniciales
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    if (this.activateRoute.snapshot.params.id) {
      const mayorTownId = Number(this.activateRoute.snapshot.params.id);
      this.getMayorTown(mayorTownId);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      start_date: [null, [Validators.required]], // Para input type="date"
      end_date: [null, [Validators.required]],   // Para input type="date"
      mayor_id: [null, [Validators.required]],
      town_id: [null, [Validators.required]]
    });
  }

  loadMayorsForDropdown(): void {
    this.mayorService.list().subscribe({
      next: (data) => this.mayors = data,
      error: (err) => {
        console.error("Error loading mayors", err);
        Swal.fire('Error', 'No se pudieron cargar los alcaldes.', 'error');
      }
    });
  }

  loadTownsForDropdown(): void {
    this.townService.list().subscribe({
      next: (data) => this.towns = data,
      error: (err) => {
        console.error("Error loading towns", err);
        Swal.fire('Error', 'No se pudieron cargar las ciudades.', 'error');
      }
    });
  }

  get fg() {
    return this.theFormGroup.controls;
  }

  getMayorTown(id: number) {
    this.mayorTownService.view(id).subscribe({
      next: (data) => {
        this.theMayorTown = data;
        this.theFormGroup.patchValue({
          start_date: this.theMayorTown.start_date ? DateTime.fromISO(this.theMayorTown.start_date).toFormat('yyyy-MM-dd') : null,
          end_date: this.theMayorTown.end_date ? DateTime.fromISO(this.theMayorTown.end_date).toFormat('yyyy-MM-dd') : null,
          mayor_id: this.theMayorTown.mayor_id,
          town_id: this.theMayorTown.town_id
        });
        if (this.mode === 1) {
          this.theFormGroup.disable();
        }
      },
      error: (error) => {
        console.error("Error fetching mayor-town relation", error);
        Swal.fire('Error', 'No se pudo cargar la relación alcalde-ciudad.', 'error');
        this.router.navigate(['/mayor-town/list']);
      }
    });
  }

  private formatDateForBackend(inputDate: string | null | undefined): string | null {
    if (!inputDate) return null;
    try {
      // El input type="date" da 'yyyy-MM-dd', que coincide con el format del validador de Adonis.
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

    const startMDate = DateTime.fromISO(this.theFormGroup.value.start_date);
    const endMDate = DateTime.fromISO(this.theFormGroup.value.end_date);
    const today = DateTime.now().startOf('day');

    // Validar start_date según el modo y las reglas de Adonis
    if (this.mode === 2 && startMDate > today) { // Crear: beforeOrEqual('today')
        Swal.fire('Error en Fecha de Inicio', 'La fecha de inicio no puede ser futura.', 'error');
        return;
    }
    if (this.mode === 3 && this.fg.start_date.dirty && startMDate < today) { // Actualizar: afterOrEqual('today') - Lógica invertida
        // La regla de Adonis 'afterOrEqual(today)' para start_date en update es inusual.
        // Si significa que la nueva fecha de inicio no puede ser *anterior* a hoy si se cambia,
        // entonces está bien. Si significa que debe ser hoy o futura, ajusta el mensaje.
        // Por ahora, interpreto que la fecha de inicio no puede ser *anterior* a hoy si la modificas.
        Swal.fire('Error en Fecha de Inicio', 'La fecha de inicio (si se modifica) no puede ser anterior a hoy.', 'error');
        return;
    }


    if (endMDate <= startMDate) {
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
    const mayorTownToCreate: MayorTown = {
      ...this.theFormGroup.value,
      start_date: this.formatDateForBackend(this.theFormGroup.value.start_date)!,
      end_date: this.formatDateForBackend(this.theFormGroup.value.end_date)!,
    };

    this.mayorTownService.create(mayorTownToCreate).subscribe({
      next: (data) => {
        Swal.fire('Creado', 'La relación alcalde-ciudad ha sido creada exitosamente.', 'success');
        this.router.navigate(['/mayor-town/list']);
      },
      error: (error) => {
        console.error("Error creating mayor-town relation", error);
        let errorMessage = 'Ocurrió un error al crear la relación.';
        if (error.error) {
          errorMessage = this.formatAdonisError(error.error);
        }
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  update() {
    const mayorTownToUpdate: MayorTown = {
      id: this.theMayorTown.id,
      ...this.theFormGroup.value,
      start_date: this.formatDateForBackend(this.theFormGroup.value.start_date)!,
      end_date: this.formatDateForBackend(this.theFormGroup.value.end_date)!,
    };

    this.mayorTownService.update(mayorTownToUpdate).subscribe({
      next: (data) => {
        Swal.fire('Actualizado', 'La relación alcalde-ciudad ha sido actualizada exitosamente.', 'success');
        this.router.navigate(['/mayor-town/list']);
      },
      error: (error) => {
        console.error("Error updating mayor-town relation", error);
        let errorMessage = 'Ocurrió un error al actualizar la relación.';
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
    this.router.navigate(['/mayor-town/list']);
  }
}