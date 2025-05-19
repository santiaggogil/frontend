// src/app/pages/packages/manage/manage.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { Package } from '../../../models/package.model'; // Ajusta la ruta
import { PackageService } from '../../../services/package.service'; // Ajusta la ruta
import { Service } from '../../../models/service.model'; // Para el dropdown
import { ServiceService } from '../../../services/service.service'; // Para cargar servicios

@Component({
  selector: 'app-package-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; // 1 - view, 2 - create, 3 - update
  thePackage!: Package; // Usar 'definite assignment assertion'
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  services: Service[] = []; // Para el dropdown de servicios

  constructor(
    private activateRoute: ActivatedRoute,
    private packageService: PackageService,
    private serviceService: ServiceService, // Para cargar los servicios
    private router: Router,
    private readonly theFormBuilder: FormBuilder
  ) {
    this.mode = 1; // Default
  }

  ngOnInit(): void {
    this.loadServicesForDropdown(); // Cargar servicios para el select
    this.configFormGroup();

    const currentUrl = this.activateRoute.snapshot.url.join('/');

    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
      this.thePackage = { name: '', description: '', service_id: undefined }; // Valores por defecto para crear
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    if (this.activateRoute.snapshot.params.id) {
      const packageId = Number(this.activateRoute.snapshot.params.id);
      this.getPackage(packageId);
    }
  }

  loadServicesForDropdown(): void {
    this.serviceService.list().subscribe({ // Asumiendo que tu ServiceService tiene un método list()
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
    this.theFormGroup = this.theFormBuilder.group({
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100)
          // La validación 'unique' se maneja en el backend
        ]
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500)
        ]
      ],
      service_id: [
        null, // o un valor por defecto si es 'create' y quieres preseleccionar
        [Validators.required]
        // La validación 'exists' se maneja en el backend
      ]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getPackage(id: number) {
    this.packageService.view(id).subscribe({
      next: (data) => {
        this.thePackage = data;
        this.theFormGroup.patchValue({
          name: this.thePackage.name,
          description: this.thePackage.description,
          service_id: this.thePackage.service_id
        });
        if (this.mode === 1) {
          this.theFormGroup.disable();
        }
      },
      error: (error) => {
        console.error("Error fetching package", error);
        Swal.fire('Error', 'No se pudo cargar el paquete.', 'error');
        this.router.navigate(['/packages/list']); // O una ruta de fallback
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

    const packageToCreate: Package = {
      ...this.theFormGroup.value,
    };

    this.packageService.create(packageToCreate).subscribe({
      next: (data) => {
        Swal.fire('Creado', 'El paquete ha sido creado exitosamente.', 'success');
        this.router.navigate(['/packages/list']);
      },
      error: (error) => {
        console.error("Error creating package", error);
        let errorMessage = 'Ocurrió un error al crear el paquete.';
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

    const packageToUpdate: Package = {
      id: this.thePackage.id,
      ...this.theFormGroup.value,
    };

    this.packageService.update(packageToUpdate).subscribe({
      next: (data) => {
        Swal.fire('Actualizado', 'El paquete ha sido actualizado exitosamente.', 'success');
        this.router.navigate(['/packages/list']);
      },
      error: (error) => {
        console.error("Error updating package", error);
        let errorMessage = 'Ocurrió un error al actualizar el paquete.';
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
    this.router.navigate(['/packages/list']);
  }
}
