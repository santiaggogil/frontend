import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { Shift } from 'src/app/models/shift.model';
import { ShiftService } from 'src/app/services/shift.service';

@Component({
  selector: 'app-manage-shift',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageShiftComponent implements OnInit {

  mode: number = 1; // 1 - view, 2 - create, 3 - update
  shift!: Shift;
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  currentId?: number;

  constructor(
    private activateRoute: ActivatedRoute,
    private shiftService: ShiftService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.shift = {} as Shift;
    this.configFormGroup();
  }

  ngOnInit(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    const idFromRoute = this.activateRoute.snapshot.params['id'];
    if (idFromRoute) {
      this.currentId = +idFromRoute;
    }

    if ((this.mode === 1 || this.mode === 3) && this.currentId) {
      this.getShift(this.currentId);
    } else if (this.mode === 2) {
      if (this.theFormGroup) this.theFormGroup.enable();
    } else if (this.mode === 1) {
      if (this.theFormGroup) this.theFormGroup.disable();
    }
  }

  configFormGroup() {
    this.theFormGroup = this.fb.group({
      machine_id: [null, [Validators.required, Validators.min(1)]],
      operator_id: [null, [Validators.required, Validators.min(1)]],
      start_time: ['', [Validators.required]],
      end_time: ['', [Validators.required]]
    }, { validators: this.timeRangeValidator });
  }

  timeRangeValidator(group: AbstractControl): ValidationErrors | null {
    const startTimeStr = group.get('start_time')?.value;
    const endTimeStr = group.get('end_time')?.value;

    if (startTimeStr && endTimeStr) {
      const [startHours, startMinutes] = startTimeStr.split(':').map(Number);
      const [endHours, endMinutes] = endTimeStr.split(':').map(Number);

      const startTimeInMinutes = startHours * 60 + startMinutes;
      const endTimeInMinutes = endHours * 60 + endMinutes;

      // Este validador previene que la hora de fin sea estrictamente menor o igual
      // a la hora de inicio EN EL MISMO DÍA.
      // Si el usuario introduce 22:00 y 02:00, este validador marcará error.
      // La lógica de "día siguiente" en prepareShiftData() se aplicaría si este validador fuera más permisivo.
      // Para que la lógica de "día siguiente" funcione como se espera para 22:00 -> 02:00,
      // esta condición debería ser eliminada o ajustada.
      // Por ahora, la mantengo como en tu original, lo que significa que 22:00-02:00 fallará la validación del form.
      if (endTimeInMinutes <= startTimeInMinutes) {
        return { timeRangeInvalid: true };
      }
    }
    return null;
  }

  private formatTimeForInput(dateTimeString?: string): string {
    if (!dateTimeString) return '';
    try {
      const dateObj = new Date(dateTimeString);
      const hours = dateObj.getHours().toString().padStart(2, '0');
      const minutes = dateObj.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (e) {
      // Si la cadena no es una fecha válida, o ya es HH:mm, devolverla tal cual
      // o manejar el error como se prefiera. El input type="time" espera HH:mm.
      if (typeof dateTimeString === 'string' && /^\d{2}:\d{2}(:\d{2})?$/.test(dateTimeString)) {
        return dateTimeString.substring(0,5); // Asegura HH:mm
      }
      console.warn("Could not format time string for input: ", dateTimeString);
      return '';
    }
  }

  getShift(id: number) {
    this.shiftService.view(id).subscribe({
      next: (responseData) => {
        if (responseData) {
          this.shift = responseData;
          this.theFormGroup.patchValue({
            machine_id: this.shift.machine_id,
            operator_id: this.shift.operator_id,
            start_time: this.formatTimeForInput(this.shift.start_time),
            end_time: this.formatTimeForInput(this.shift.end_time)
          });

          if (this.mode === 1) {
            this.theFormGroup.disable();
          }
        } else {
          Swal.fire('Error', 'La respuesta del servidor no tiene el formato esperado para el turno.', 'error');
          this.router.navigate(['/shifts/list']);
        }
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo cargar el turno.';
        Swal.fire('Error', errorMessage, 'error');
        this.router.navigate(['/shifts/list']);
      }
    });
  }

  get formControls() {
    return this.theFormGroup.controls;
  }

  back() {
    this.router.navigate(['/shifts/list']);
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private formatDateTimeForMySQL(dateObj: Date): string {
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    const hours = dateObj.getHours().toString().padStart(2, '0');
    const minutes = dateObj.getMinutes().toString().padStart(2, '0');
    const seconds = dateObj.getSeconds().toString().padStart(2, '0'); // MySQL DATETIME necesita segundos
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  private prepareShiftData(formData: any): Shift {
    const [startHours, startMinutes] = formData.start_time.split(':').map(Number);
    const [endHours, endMinutes] = formData.end_time.split(':').map(Number);

    let startDate = new Date(); // Fecha actual como base
    startDate.setHours(startHours, startMinutes, 0, 0); // Establecer hora, minutos, segundos, ms

    let endDate = new Date(); // Fecha actual como base
    endDate.setHours(endHours, endMinutes, 0, 0);

    // Si la hora de fin es anterior o igual a la de inicio, asumir que es del día siguiente
    if (endDate.getTime() <= startDate.getTime()) {
      endDate.setDate(endDate.getDate() + 1);
    }

    return {
      ...formData,
      machine_id: +formData.machine_id,
      operator_id: +formData.operator_id,
      start_time: this.formatDateTimeForMySQL(startDate),
      end_time: this.formatDateTimeForMySQL(endDate),
    };
  }

  create() {
    this.trySend = true;
    this.markFormGroupTouched(this.theFormGroup);

    if (this.theFormGroup.invalid) {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos requeridos correctamente y asegúrese que las horas son válidas.', 'error');
      return;
    }

    const dataToCreate = this.prepareShiftData(this.theFormGroup.value);

    this.shiftService.create(dataToCreate).subscribe({
      next: () => {
        Swal.fire('Creado', "Turno creado correctamente.", 'success');
        this.router.navigate(['/shifts/list']);
      },
      error: (err) => {
        // Loggear el error específico del backend si está disponible
        console.error("Error from backend:", err);
        let errorMessage = 'No se pudo crear el turno.';
        if (err.error && err.error.sqlMessage) { // Específico para tu error de backend
            errorMessage = `Error al crear: ${err.error.sqlMessage}`;
        } else if (err.error && err.error.message) {
            errorMessage = err.error.message;
        }
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  update() {
    this.trySend = true;
    this.markFormGroupTouched(this.theFormGroup);

    if (this.theFormGroup.invalid) {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos editables requeridos correctamente y asegúrese que las horas son válidas.', 'error');
      return;
    }

    const formValues = this.theFormGroup.getRawValue();
    const dataToUpdate = this.prepareShiftData({
      ...formValues,
      id: this.shift.id // Asegurarse de que el ID se incluya para la actualización
    });

    this.shiftService.update(dataToUpdate).subscribe({
      next: () => {
        Swal.fire('Actualizado', "Turno actualizado correctamente.", 'success');
        this.router.navigate(['/shifts/list']);
      },
      error: (err) => {
        console.error("Error from backend:", err);
        let errorMessage = 'No se pudo actualizar el turno.';
        if (err.error && err.error.sqlMessage) {
            errorMessage = `Error al actualizar: ${err.error.sqlMessage}`;
        } else if (err.error && err.error.message) {
            errorMessage = err.error.message;
        }
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }
}
