// src/app/pages/reviews/manage/manage.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DateTime } from 'luxon'; // Para manejar fechas

import { Review } from '../../../models/review.model'; // Ajusta la ruta
import { ReviewService } from '../../../services/review.service'; // Ajusta la ruta
// import { Machine } from '../../../models/machine.model'; // Comentado
// import { MachineService } from '../../../services/machine.service'; // Comentado
import { Package } from '../../../models/package.model'; // Para el dropdown
import { PackageService } from '../../../services/package.service'; // Para cargar paquetes

@Component({
  selector: 'app-review-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; // 1 - view, 2 - create, 3 - update
  theReview!: Review;
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  // machines: Machine[] = []; // Comentado
  packages: Package[] = [];

  constructor(
    private activateRoute: ActivatedRoute,
    private reviewService: ReviewService,
    // private machineService: MachineService, // Comentado
    private packageService: PackageService,
    private router: Router,
    private readonly theFormBuilder: FormBuilder
  ) {
    this.mode = 1; // Default
  }

  ngOnInit(): void {
    // this.loadMachinesForDropdown(); // Comentado
    this.loadPackagesForDropdown();
    this.configFormGroup();

    const currentUrl = this.activateRoute.snapshot.url.join('/');

    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
      this.theReview = { observation: '', date: '', /* machine_id: undefined, */ package_id: undefined }; // machine_id comentado en inicialización
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    if (this.activateRoute.snapshot.params.id) {
      const reviewId = Number(this.activateRoute.snapshot.params.id);
      this.getReview(reviewId);
    }
  }

  /* // Comentado - Funcionalidad de Machines
  loadMachinesForDropdown(): void {
    this.machineService.list().subscribe({
      next: (data) => this.machines = data,
      error: (err) => {
        console.error("Error loading machines", err);
        Swal.fire('Error', 'No se pudieron cargar las máquinas.', 'error');
      }
    });
  }
  */

  loadPackagesForDropdown(): void {
    this.packageService.list().subscribe({
      next: (data) => this.packages = data,
      error: (err) => {
        console.error("Error loading packages", err);
        Swal.fire('Error', 'No se pudieron cargar los paquetes.', 'error');
      }
    });
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      observation: [
        null,
        [Validators.minLength(5), Validators.maxLength(1000)]
      ],
      date: [
        null,
        [Validators.required]
      ],
      /* // Comentado - Campo machine_id
      machine_id: [
        null,
        [Validators.required]
      ],
      */
      machine_id: [null], // Lo dejamos como null por ahora, sin validadores
      package_id: [
        null,
        [Validators.required]
      ]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getReview(id: number) {
    this.reviewService.view(id).subscribe({
      next: (data) => {
        this.theReview = data;
        this.theFormGroup.patchValue({
          observation: this.theReview.observation,
          date: this.theReview.date ? DateTime.fromISO(this.theReview.date).toFormat('yyyy-MM-dd') : null,
          machine_id: this.theReview.machine_id, // Se intentará parchar, pero el control del form está simplificado
          package_id: this.theReview.package_id
        });
        if (this.mode === 1) {
          this.theFormGroup.disable();
        }
      },
      error: (error) => {
        console.error("Error fetching review", error);
        Swal.fire('Error', 'No se pudo cargar la revisión.', 'error');
        this.router.navigate(['/reviews/list']);
      }
    });
  }

  private formatDateForBackend(isoDateString: string | null | undefined): string | null {
    if (!isoDateString) return null;
    try {
      return DateTime.fromISO(isoDateString).toFormat('yyyy-MM-dd');
    } catch (e) {
      console.error("Error formatting date for backend:", e);
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
    // Temporalmente removemos la validación de machine_id si el control está simplificado
    // if (this.theFormGroup.invalid) {
    // Adaptamos la validación para los campos activos
    const tempForm = this.theFormBuilder.group({ // Grupo temporal para validación
        observation: this.theFormGroup.get('observation')?.value,
        date: this.theFormGroup.get('date')?.value,
        package_id: this.theFormGroup.get('package_id')?.value,
    });
    // Reaplicamos validadores que sí queremos chequear
    tempForm.get('date')?.setValidators([Validators.required]);
    tempForm.get('package_id')?.setValidators([Validators.required]);
    tempForm.updateValueAndValidity();


    if (tempForm.invalid) {
      Swal.fire('Error de Validación', 'Por favor, complete los campos de fecha y paquete.', 'error');
      return;
    }

    const reviewToCreate: Review = {
      observation: this.theFormGroup.value.observation,
      date: this.formatDateForBackend(this.theFormGroup.value.date),
      // machine_id: this.theFormGroup.value.machine_id, // Comentado o se enviará null si el control existe sin valor
      package_id: this.theFormGroup.value.package_id
    };
    // Si machine_id no debe enviarse en absoluto si no hay selección:
    if (this.theFormGroup.value.machine_id) {
        reviewToCreate.machine_id = this.theFormGroup.value.machine_id;
    }


    this.reviewService.create(reviewToCreate).subscribe({
      next: (data) => {
        Swal.fire('Creado', 'La revisión ha sido creada exitosamente.', 'success');
        this.router.navigate(['/reviews/list']);
      },
      error: (error) => {
        console.error("Error creating review", error);
        let errorMessage = 'Ocurrió un error al crear la revisión.';
        if (error.error) {
          errorMessage = this.formatAdonisError(error.error);
        }
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  update() {
    this.trySend = true;
    // Adaptamos la validación similar a create
    const tempForm = this.theFormBuilder.group({
        observation: this.theFormGroup.get('observation')?.value,
        date: this.theFormGroup.get('date')?.value,
        package_id: this.theFormGroup.get('package_id')?.value,
    });
    tempForm.get('date')?.setValidators([Validators.required]);
    tempForm.get('package_id')?.setValidators([Validators.required]);
    tempForm.updateValueAndValidity();

    if (tempForm.invalid) {
      Swal.fire('Error de Validación', 'Por favor, complete los campos de fecha y paquete.', 'error');
      return;
    }

    const reviewToUpdate: Review = {
      id: this.theReview.id,
      observation: this.theFormGroup.value.observation,
      date: this.formatDateForBackend(this.theFormGroup.value.date),
      // machine_id: this.theFormGroup.value.machine_id, // Comentado o se enviará null/valor actual
      package_id: this.theFormGroup.value.package_id
    };
    // Si machine_id no debe enviarse en absoluto si no hay selección, o si no se modifica:
    if (this.theFormGroup.value.machine_id) { // o this.theFormGroup.get('machine_id')?.dirty
        reviewToUpdate.machine_id = this.theFormGroup.value.machine_id;
    }


    this.reviewService.update(reviewToUpdate).subscribe({
      next: (data) => {
        Swal.fire('Actualizado', 'La revisión ha sido actualizada exitosamente.', 'success');
        this.router.navigate(['/reviews/list']);
      },
      error: (error) => {
        console.error("Error updating review", error);
        let errorMessage = 'Ocurrió un error al actualizar la revisión.';
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
    this.router.navigate(['/reviews/list']);
  }
}