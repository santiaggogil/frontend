// src/app/pages/projects/manage/manage.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DateTime } from 'luxon';

import { Project } from '../../../models/project.model';
import { ProjectService } from '../../../services/project.service';
import { Package } from '../../../models/package.model';
import { PackageService } from '../../../services/package.service';

@Component({
  selector: 'app-project-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number = 1; // 1 - view, 2 - create, 3 - update
  theProject!: Project;
  theFormGroup!: FormGroup; // Se inicializará en ngOnInit
  trySend: boolean = false;
  packages: Package[] = [];
  statusOptions: string[] = ['planning', 'in_progress', 'completed', 'on_hold', 'cancelled'];

  constructor(
    private activateRoute: ActivatedRoute,
    private projectService: ProjectService,
    private packageService: PackageService,
    private router: Router,
    private readonly theFormBuilder: FormBuilder // 'readonly' es una buena práctica aquí
  ) {}

  ngOnInit(): void {
    this.configFormGroup(); // Asegúrate que esto se llama primero y define todos los controles
    this.loadPackagesForDropdown(); // Carga esto después de que el form group esté configurado

    const currentUrl = this.activateRoute.snapshot.url.join('/');

    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
      // Inicializa theProject con valores por defecto para 'create'
      // Es importante que 'status' tenga un valor que esté en statusOptions si quieres que se preseleccione
      this.theProject = { name: '', status: 'planning', budget: 0, location: '', package_id: undefined, start_date: '', end_date: '' };
      // Parchea el valor por defecto del status en el formulario
      this.theFormGroup.patchValue({ status: this.theProject.status });
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    if (this.activateRoute.snapshot.params.id) {
      const projectId = Number(this.activateRoute.snapshot.params.id);
      this.getProject(projectId);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      start_date: [null, [Validators.required]],
      end_date: [null, [Validators.required]],
      status: ['planning', [Validators.required, Validators.maxLength(255)]], // Valor inicial para el control
      budget: [null, [Validators.required, Validators.min(1), Validators.max(100000000), Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
      location: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      package_id: [null, [Validators.required]]
    });
  }

  loadPackagesForDropdown(): void {
    this.packageService.list().subscribe({
      next: (data) => {
        this.packages = data;
      },
      error: (err) => {
        console.error("Error loading packages for dropdown", err);
        Swal.fire('Error', 'No se pudieron cargar los paquetes para la selección.', 'error');
      }
    });
  }

  // El getter para los controles del formulario es útil para la plantilla
  get fg() { // Renombrado a 'fg' para ser más corto y evitar colisiones de nombres
    return this.theFormGroup.controls;
  }

  getProject(id: number) {
    this.projectService.view(id).subscribe({
      next: (data) => {
        this.theProject = data;
        this.theFormGroup.patchValue({
          name: this.theProject.name,
          start_date: this.theProject.start_date ? DateTime.fromSQL(this.theProject.start_date).toFormat("yyyy-MM-dd'T'HH:mm") : null,
          end_date: this.theProject.end_date ? DateTime.fromSQL(this.theProject.end_date).toFormat("yyyy-MM-dd'T'HH:mm") : null,
          status: this.theProject.status,
          budget: this.theProject.budget,
          location: this.theProject.location,
          package_id: this.theProject.package_id
        });
        if (this.mode === 1) {
          this.theFormGroup.disable();
        }
      },
      error: (error) => {
        console.error("Error fetching project", error);
        Swal.fire('Error', 'No se pudo cargar el proyecto.', 'error');
        this.router.navigate(['/projects/list']);
      }
    });
  }

  private formatDateTimeForBackend(isoDateTimeString: string | null | undefined): string | null {
    if (!isoDateTimeString) return null;
    try {
      return DateTime.fromISO(isoDateTimeString).toFormat('yyyy-MM-dd HH:mm:ss');
    } catch (e) {
      console.error("Error formatting date for backend:", e, "Input was:", isoDateTimeString); // Loguear el input problemático
      return null;
    }
  }

  onSubmit(): void {
    this.trySend = true; // Mueve trySend aquí para que se active solo al intentar enviar
    if (this.theFormGroup.invalid) {
      Swal.fire('Error de Validación', 'Por favor, complete todos los campos requeridos correctamente.', 'error');
      // Forzar la visualización de errores en todos los campos tocados
      Object.values(this.theFormGroup.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    if (this.mode === 2) {
      this.create();
    } else if (this.mode === 3) {
      this.update();
    }
  }

  create() {
    // La validación ya se hizo en onSubmit
    const startDate = DateTime.fromISO(this.theFormGroup.value.start_date);
    const endDate = DateTime.fromISO(this.theFormGroup.value.end_date);

    if (!startDate.isValid || !endDate.isValid) {
        Swal.fire('Error de Fechas', 'Las fechas ingresadas no son válidas.', 'error');
        return;
    }
    if (endDate < startDate) {
      Swal.fire('Error de Fechas', 'La fecha de finalización no puede ser anterior a la fecha de inicio.', 'error');
      return;
    }

    const projectToCreate: Project = {
      ...this.theFormGroup.value,
      start_date: this.formatDateTimeForBackend(this.theFormGroup.value.start_date)!,
      end_date: this.formatDateTimeForBackend(this.theFormGroup.value.end_date)!,
    };

    this.projectService.create(projectToCreate).subscribe({
      next: (data) => {
        Swal.fire('Creado', 'El proyecto ha sido creado exitosamente.', 'success');
        this.router.navigate(['/projects/list']);
      },
      error: (error) => {
        console.error("Error creating project", error);
        let errorMessage = 'Ocurrió un error al crear el proyecto.';
        if (error.error) {
          errorMessage = this.formatAdonisError(error.error);
        }
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  update() {
    // La validación ya se hizo en onSubmit
    const startDate = DateTime.fromISO(this.theFormGroup.value.start_date);
    const endDate = DateTime.fromISO(this.theFormGroup.value.end_date);

    if (!startDate.isValid || !endDate.isValid) {
        Swal.fire('Error de Fechas', 'Las fechas ingresadas no son válidas.', 'error');
        return;
    }
    if (endDate < startDate) {
      Swal.fire('Error de Fechas', 'La fecha de finalización no puede ser anterior a la fecha de inicio.', 'error');
      return;
    }

    const projectToUpdate: Project = {
      id: this.theProject.id,
      ...this.theFormGroup.value,
      start_date: this.formatDateTimeForBackend(this.theFormGroup.value.start_date)!,
      end_date: this.formatDateTimeForBackend(this.theFormGroup.value.end_date)!,
    };

    this.projectService.update(projectToUpdate).subscribe({
      next: (data) => {
        Swal.fire('Actualizado', 'El proyecto ha sido actualizado exitosamente.', 'success');
        this.router.navigate(['/projects/list']);
      },
      error: (error) => {
        console.error("Error updating project", error);
        let errorMessage = 'Ocurrió un error al actualizar el proyecto.';
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
    this.router.navigate(['/projects/list']);
  }
}