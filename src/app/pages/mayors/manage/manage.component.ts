// src/app/pages/mayors/manage/manage.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DateTime } from 'luxon';

import { Mayor } from '../../../models/mayor.model'; // Ajusta la ruta
import { MayorService } from '../../../services/mayor.service'; // Ajusta la ruta
// import { User } from '../../../models/user.model';
// import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-mayor-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number = 1;
  theMayor!: Mayor;
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  // users: User[] = [];

  constructor(
    private activateRoute: ActivatedRoute,
    private mayorService: MayorService,
    // private userService: UserService,
    private router: Router,
    private readonly theFormBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.configFormGroup();
    // this.loadUsersForDropdown();

    const currentUrl = this.activateRoute.snapshot.url.join('/');

    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
      this.theMayor = { user_id: '', phone: '' }; // Valores iniciales
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    if (this.activateRoute.snapshot.params.id) {
      const mayorId = Number(this.activateRoute.snapshot.params.id);
      this.getMayor(mayorId);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      user_id: [null, [Validators.required, Validators.maxLength(255)]],
      phone: [null, [Validators.required, Validators.maxLength(15)]],
      start_m: [null, [Validators.required]], // Para input type="date"
      end_m: [null, [Validators.required]]    // Para input type="date"
    });
  }

  /*
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

  getMayor(id: number) {
    this.mayorService.view(id).subscribe({
      next: (data) => {
        this.theMayor = data;
        this.theFormGroup.patchValue({
          user_id: this.theMayor.user_id,
          phone: this.theMayor.phone,
          // Asumimos que la API devuelve start_m y end_m en formato que Luxon puede parsear (ISO o yyyy-MM-dd)
          start_m: this.theMayor.start_m ? DateTime.fromISO(this.theMayor.start_m).toFormat('yyyy-MM-dd') : null,
          end_m: this.theMayor.end_m ? DateTime.fromISO(this.theMayor.end_m).toFormat('yyyy-MM-dd') : null,
        });
        if (this.mode === 1) {
          this.theFormGroup.disable();
        }
      },
      error: (error) => {
        console.error("Error fetching mayor", error);
        Swal.fire('Error', 'No se pudo cargar el alcalde.', 'error');
        this.router.navigate(['/mayors/list']);
      }
    });
  }

  private formatDateForBackend(inputDate: string | null | undefined): string | null {
    if (!inputDate) return null;
    try {
      // El input type="date" da 'yyyy-MM-dd'.
      // Asumimos que el backend (validador de Adonis) también espera 'yyyy-MM-dd'
      // si esa es la convención para los campos _m (mandato).
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

    const startMDate = DateTime.fromISO(this.theFormGroup.value.start_m);
    const endMDate = DateTime.fromISO(this.theFormGroup.value.end_m);
    const today = DateTime.now().startOf('day');

    if (startMDate >= today && this.mode === 2) {
        Swal.fire('Error en Fecha de Inicio', 'La fecha de inicio debe ser anterior al día actual.', 'error');
        return;
    }
     if (this.mode === 3 && this.fg.start_m.dirty && startMDate >= today) {
        Swal.fire('Error en Fecha de Inicio', 'La fecha de inicio debe ser anterior al día actual.', 'error');
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
    const mayorToCreate: Mayor = {
      ...this.theFormGroup.value, // Esto ya tiene user_id, phone, start_m, end_m con los nombres correctos
      start_m: this.formatDateForBackend(this.theFormGroup.value.start_m)!,
      end_m: this.formatDateForBackend(this.theFormGroup.value.end_m)!,
    };

    this.mayorService.create(mayorToCreate).subscribe({
      next: (data) => {
        Swal.fire('Creado', 'El alcalde ha sido registrado exitosamente.', 'success');
        this.router.navigate(['/mayors/list']);
      },
      error: (error) => {
        console.error("Error creating mayor", error);
        let errorMessage = 'Ocurrió un error al registrar el alcalde.';
        if (error.error) {
          errorMessage = this.formatAdonisError(error.error);
        }
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  update() {
    const mayorToUpdate: Mayor = {
      id: this.theMayor.id,
      ...this.theFormGroup.value, // Esto ya tiene user_id, phone, start_m, end_m con los nombres correctos
      start_m: this.formatDateForBackend(this.theFormGroup.value.start_m)!,
      end_m: this.formatDateForBackend(this.theFormGroup.value.end_m)!,
    };

    this.mayorService.update(mayorToUpdate).subscribe({
      next: (data) => {
        Swal.fire('Actualizado', 'El alcalde ha sido actualizado exitosamente.', 'success');
        this.router.navigate(['/mayors/list']);
      },
      error: (error) => {
        console.error("Error updating mayor", error);
        let errorMessage = 'Ocurrió un error al actualizar el alcalde.';
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
    this.router.navigate(['/mayors/list']);
  }
}