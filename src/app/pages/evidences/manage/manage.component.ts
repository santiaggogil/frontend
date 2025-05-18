// src/app/pages/evidences/manage/manage.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { Evidence } from '../../../models/evidence.model'; // Ajusta la ruta
import { EvidenceService } from '../../../services/evidence.service'; // Ajusta la ruta
import { Service } from '../../../models/service.model'; // Para el dropdown
import { ServiceService } from '../../../services/service.service'; // Para cargar servicios

@Component({
  selector: 'app-evidence-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; // 1 - view, 2 - create, 3 - update
  theEvidence!: Evidence;
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  services: Service[] = []; // Para el dropdown de servicios

  constructor(
    private activateRoute: ActivatedRoute,
    private evidenceService: EvidenceService,
    private serviceService: ServiceService, // Para cargar los servicios
    private router: Router,
    private readonly theFormBuilder: FormBuilder
  ) {
    this.mode = 1; // Default
  }

  ngOnInit(): void {
    this.loadServicesForDropdown();
    this.configFormGroup();

    const currentUrl = this.activateRoute.snapshot.url.join('/');

    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
      this.theEvidence = { brand: '', model: '', serial_number: '', service_id: undefined }; // Valores por defecto
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    if (this.activateRoute.snapshot.params.id) {
      const evidenceId = Number(this.activateRoute.snapshot.params.id);
      this.getEvidence(evidenceId);
    }
  }

  loadServicesForDropdown(): void {
    this.serviceService.list().subscribe({
      next: (data) => {
        this.services = data;
      },
      error: (err) => {
        console.error("Error loading services for dropdown", err);
        Swal.fire('Error', 'No se pudieron cargar los servicios para la selección.', 'error');
      }
    });
  }

  configFormGroup() {
    // Para el modo CREATE, los campos son requeridos según el validador de Adonis
    // Para el modo UPDATE, son opcionales. Ajustaremos los validadores dinámicamente
    // si es necesario, o simplemente dejaremos que el backend maneje la opcionalidad.
    // Por simplicidad, los marcamos como requeridos en el frontend para una mejor UX al crear.
    this.theFormGroup = this.theFormBuilder.group({
      brand: [
        null,
        [Validators.required, Validators.maxLength(255)]
      ],
      model: [
        null,
        [Validators.required, Validators.maxLength(255)]
      ],
      serial_number: [
        null,
        [Validators.required, Validators.maxLength(255)]
      ],
      service_id: [
        null,
        [Validators.required]
      ]
    });

    // Si estamos en modo UPDATE, podríamos quitar los Validators.required
    // pero es mejor mantenerlos para que el usuario no deje campos vacíos accidentalmente
    // que antes tenían valor. El backend ya maneja la opcionalidad.
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getEvidence(id: number) {
    this.evidenceService.view(id).subscribe({
      next: (data) => {
        this.theEvidence = data;
        this.theFormGroup.patchValue({
          brand: this.theEvidence.brand,
          model: this.theEvidence.model,
          serial_number: this.theEvidence.serial_number,
          service_id: this.theEvidence.service_id
        });
        if (this.mode === 1) {
          this.theFormGroup.disable();
        }
      },
      error: (error) => {
        console.error("Error fetching evidence", error);
        Swal.fire('Error', 'No se pudo cargar la evidencia.', 'error');
        this.router.navigate(['/evidences/list']);
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

    const evidenceToCreate: Evidence = {
      ...this.theFormGroup.value,
    };

    this.evidenceService.create(evidenceToCreate).subscribe({
      next: (data) => {
        Swal.fire('Creado', 'La evidencia ha sido creada exitosamente.', 'success');
        this.router.navigate(['/evidences/list']);
      },
      error: (error) => {
        console.error("Error creating evidence", error);
        let errorMessage = 'Ocurrió un error al crear la evidencia.';
        if (error.error) {
          errorMessage = this.formatAdonisError(error.error);
        }
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  update() {
    this.trySend = true;
    // En update, los campos son opcionales en backend, pero si el form es inválido por maxLength,
    // igual queremos detenerlo.
    if (this.theFormGroup.invalid && this.mode === 3) {
        // Chequear específicamente si el error es por 'required' y no otro (como maxLength)
        let  isRequiredErrorPresent = false;
        Object.keys(this.theFormGroup.controls).forEach(key => {
            const controlErrors = this.theFormGroup.get(key)?.errors;
            if (controlErrors && controlErrors.required) {
                isRequiredErrorPresent = true;
            }
        });
        // Si solo hay errores de 'required' y estamos en update, podríamos permitirlo
        // si el backend lo maneja. Pero por UX, es mejor que el usuario complete.
        // O podrías tener un Form Group diferente para update.
        // Por ahora, mantenemos la validación estricta del frontend.
         if (this.theFormGroup.invalid) { // Mantenemos la validación estricta
            Swal.fire('Error de Validación', 'Por favor, revise los campos del formulario.', 'error');
            return;
         }
    }


    const evidenceToUpdate: Evidence = {
      id: this.theEvidence.id,
      ...this.theFormGroup.value,
    };
    // Para campos opcionales en la actualización, solo envía los que tienen valor
    // o los que han sido modificados, si el backend espera solo los campos a cambiar.
    // El spread operator ya maneja esto si los valores son null o undefined.
    // Si el backend espera que no se envíen los campos no modificados, la lógica sería más compleja.

    this.evidenceService.update(evidenceToUpdate).subscribe({
      next: (data) => {
        Swal.fire('Actualizado', 'La evidencia ha sido actualizada exitosamente.', 'success');
        this.router.navigate(['/evidences/list']);
      },
      error: (error) => {
        console.error("Error updating evidence", error);
        let errorMessage = 'Ocurrió un error al actualizar la evidencia.';
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
    this.router.navigate(['/evidences/list']);
  }
}