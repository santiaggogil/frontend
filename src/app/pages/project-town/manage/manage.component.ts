// src/app/pages/project-town/manage/manage.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DateTime } from 'luxon';

import { ProjectTown } from '../../../models/project-town.model'; // Ajusta la ruta
import { ProjectTownService } from '../../../services/project-town.service'; // Ajusta la ruta
import { Town } from '../../../models/town.model'; // Para el dropdown
import { TownService } from '../../../services/town.service'; // Para cargar ciudades
import { Project } from '../../../models/project.model'; // Para el dropdown
import { ProjectService } from '../../../services/project.service'; // Para cargar proyectos

@Component({
  selector: 'app-project-town-manage', // Cambiado para reflejar la entidad
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit { // Renombrado de ProjectTownManageComponent a solo ManageComponent

  mode: number = 1;
  theProjectTown!: ProjectTown;
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  towns: Town[] = [];
  projects: Project[] = [];

  constructor(
    private activateRoute: ActivatedRoute,
    private projectTownService: ProjectTownService,
    private townService: TownService,
    private projectService: ProjectService,
    private router: Router,
    private readonly theFormBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.configFormGroup();
    this.loadTownsForDropdown();
    this.loadProjectsForDropdown();

    const currentUrl = this.activateRoute.snapshot.url.join('/');

    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
      this.theProjectTown = { town_id: undefined, project_id: undefined }; // Valores iniciales
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    if (this.activateRoute.snapshot.params.id) {
      const projectTownId = Number(this.activateRoute.snapshot.params.id);
      this.getProjectTown(projectTownId);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      // El validador de Adonis usa 'excution_year', tu modelo 'excution_year'. Usaré 'excution_year'.
      excution_year: [null, [Validators.required]], // Para input datetime-local
      project_id: [null, [Validators.required]],
      town_id: [null, [Validators.required]]
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

  loadProjectsForDropdown(): void {
    this.projectService.list().subscribe({
      next: (data) => this.projects = data,
      error: (err) => {
        console.error("Error loading projects", err);
        Swal.fire('Error', 'No se pudieron cargar los proyectos.', 'error');
      }
    });
  }

  get fg() {
    return this.theFormGroup.controls;
  }

  getProjectTown(id: number) {
    this.projectTownService.view(id).subscribe({
      next: (data) => {
        this.theProjectTown = data;
        this.theFormGroup.patchValue({
          excution_year: this.theProjectTown.excution_year ? DateTime.fromSQL(this.theProjectTown.excution_year).toFormat("yyyy-MM-dd'T'HH:mm") : null,
          project_id: this.theProjectTown.project_id,
          town_id: this.theProjectTown.town_id
        });
        if (this.mode === 1) {
          this.theFormGroup.disable();
        }
      },
      error: (error) => {
        console.error("Error fetching project-town relation", error);
        Swal.fire('Error', 'No se pudo cargar la relación proyecto-ciudad.', 'error');
        this.router.navigate(['/project-town/list']); // Ajusta la ruta de listado
      }
    });
  }

  private formatDateTimeForBackend(isoDateTimeString: string | null | undefined): string | null {
    if (!isoDateTimeString) return null;
    try {
      // El input datetime-local produce un string que puede ser parseado directamente por fromISO
      return DateTime.fromISO(isoDateTimeString).toFormat('yyyy-MM-dd HH:mm:ss');
    } catch (e) {
      console.error("Error formatting date for backend:", e, "Input was:", isoDateTimeString);
      return null;
    }
  }

  onSubmit(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error de Validación', 'Por favor, complete todos los campos requeridos correctamente.', 'error');
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
    const projectTownToCreate: ProjectTown = {
      ...this.theFormGroup.value,
      excution_year: this.formatDateTimeForBackend(this.theFormGroup.value.excution_year)!,
    };

    this.projectTownService.create(projectTownToCreate).subscribe({
      next: (data) => {
        Swal.fire('Creado', 'La relación proyecto-ciudad ha sido creada exitosamente.', 'success');
        this.router.navigate(['/project-town/list']); // Ajusta la ruta
      },
      error: (error) => {
        console.error("Error creating project-town relation", error);
        let errorMessage = 'Ocurrió un error al crear la relación.';
        if (error.error) {
          errorMessage = this.formatAdonisError(error.error);
        }
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  update() {
    const projectTownToUpdate: ProjectTown = {
      id: this.theProjectTown.id,
      ...this.theFormGroup.value,
      excution_year: this.formatDateTimeForBackend(this.theFormGroup.value.excution_year)!,
    };

    this.projectTownService.update(projectTownToUpdate).subscribe({
      next: (data) => {
        Swal.fire('Actualizado', 'La relación proyecto-ciudad ha sido actualizada exitosamente.', 'success');
        this.router.navigate(['/project-town/list']); // Ajusta la ruta
      },
      error: (error) => {
        console.error("Error updating project-town relation", error);
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
    this.router.navigate(['/project-town/list']); // Ajusta la ruta
  }
}