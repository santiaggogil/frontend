// src/app/pages/governors/manage/manage.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DateTime } from 'luxon';

import { Governor } from '../../../models/governor.model'; // Ajusta la ruta
import { GovernorService } from '../../../services/governor.service'; // Ajusta la ruta
// Si user_id fuera una FK a una tabla de usuarios y quisieras un dropdown:
// import { User } from '../../../models/user.model';
// import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-governor-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number = 1;
  theGovernor!: Governor;
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  // users: User[] = []; // Descomentar si user_id es un dropdown

  constructor(
    private activateRoute: ActivatedRoute,
    private governorService: GovernorService,
    // private userService: UserService, // Descomentar si user_id es un dropdown
    private router: Router,
    private readonly theFormBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.configFormGroup();
    // this.loadUsersForDropdown(); // Descomentar si user_id es un dropdown

    const currentUrl = this.activateRoute.snapshot.url.join('/');

    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
      this.theGovernor = { user_id: '', phone: '' }; // Valores iniciales
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    if (this.activateRoute.snapshot.params.id) {
      const governorId = Number(this.activateRoute.snapshot.params.id);
      this.getGovernor(governorId);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      user_id: [null, [Validators.required, Validators.maxLength(255)]], // 'unique' se valida en backend
      phone: [null, [Validators.required, Validators.maxLength(15)]],
      start_m: [null, [Validators.required]], // Para input type="date"
      end_m: [null, [Validators.required]]    // Para input type="date"
    });
  }

  /* // Descomentar si user_id es un dropdown
  loadUsersForDropdown(): void {
    this.userService.list().subscribe({
      next: (data) => this.users = data,
      error: (err) => {
        console.error("Error loading users", err);
        Swal.fire('Error', 'No se pudieron cargar los usuarios.', 'error');
      }
    });
  }
  */

  get fg() {
    return this.theFormGroup.controls;
  }

  getGovernor(id: number) {
    this.governorService.view(id).subscribe({
      next: (data) => {
        this.theGovernor = data;
        this.theFormGroup.patchValue({
          user_id: this.theGovernor.user_id,
          phone: this.theGovernor.phone,
          start_m: this.theGovernor.start_m ? DateTime.fromISO(this.theGovernor.start_m).toFormat('yyyy-MM-dd') : null,
          end_m: this.theGovernor.end_m ? DateTime.fromISO(this.theGovernor.end_m).toFormat('yyyy-MM-dd') : null,
        });
        if (this.mode === 1) {
          this.theFormGroup.disable();
        }
      },
      error: (error) => {
        console.error("Error fetching governor", error);
        Swal.fire('Error', 'No se pudo cargar el gobernador.', 'error');
        this.router.navigate(['/governors/list']);
      }
    });
  }

  private formatDateForBackend(inputDate: string | null | undefined): string | null {
    if (!inputDate) return null;
    try {
      // El input type="date" da 'yyyy-MM-dd'.
      // El validador de Adonis no especifica formato para crear, pero sí para update.
      // Para ser consistentes, enviaremos 'yyyy-MM-dd'.
      // Si el backend estrictamente requiere 'yyyy-MM-dd HH:mm:ss', se ajustaría así:
      // return DateTime.fromISO(inputDate).startOf('day').toFormat('yyyy-MM-dd HH:mm:ss');
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

    const start_mDate = DateTime.fromISO(this.theFormGroup.value.start_m);
    const end_mDate = DateTime.fromISO(this.theFormGroup.value.end_m);
    const today = DateTime.now().startOf('day');


    if (start_mDate >= today && this.mode === 2) { // Solo para creación, la regla 'before(today)' de Adonis
        Swal.fire('Error en Fecha de Inicio', 'La fecha de inicio debe ser anterior al día actual.', 'error');
        return;
    }
     if (this.mode === 3 && this.fg.start_m.dirty && start_mDate >= today) { // Para update, si se modificó
        Swal.fire('Error en Fecha de Inicio', 'La fecha de inicio debe ser anterior al día actual.', 'error');
        return;
    }


    if (end_mDate <= start_mDate) {
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
    const governorToCreate: Governor = {
      ...this.theFormGroup.value,
      start_m: this.formatDateForBackend(this.theFormGroup.value.start_m)!,
      end_m: this.formatDateForBackend(this.theFormGroup.value.end_m)!,
    };

    this.governorService.create(governorToCreate).subscribe({
      next: (data) => {
        Swal.fire('Creado', 'El gobernador ha sido registrado exitosamente.', 'success');
        this.router.navigate(['/governors/list']);
      },
      error: (error) => {
        console.error("Error creating governor", error);
        let errorMessage = 'Ocurrió un error al registrar el gobernador.';
        if (error.error) {
          errorMessage = this.formatAdonisError(error.error);
        }
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  update() {
    const governorToUpdate: Governor = {
      id: this.theGovernor.id,
      ...this.theFormGroup.value,
      start_m: this.formatDateForBackend(this.theFormGroup.value.start_m)!,
      end_m: this.formatDateForBackend(this.theFormGroup.value.end_m)!,
    };

    this.governorService.update(governorToUpdate).subscribe({
      next: (data) => {
        Swal.fire('Actualizado', 'El gobernador ha sido actualizado exitosamente.', 'success');
        this.router.navigate(['/governors/list']);
      },
      error: (error) => {
        console.error("Error updating governor", error);
        let errorMessage = 'Ocurrió un error al actualizar el gobernador.';
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
    this.router.navigate(['/governors/list']);
  }
}