import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { OperatorSpecialties } from 'src/app/models/operator-specialties.model'; // CAMBIADO
import { Operator_specialtyService } from 'src/app/services/operator-specialties.service'; // CAMBIADO

@Component({
  selector: 'app-manage-operator-specialty', // Cambia si es necesario para tu estructura
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit { // Puedes renombrar la clase si tienes otro ManageComponent

  mode: number = 1; // 1 - view, 2 - create, 3 - update
  operatorSpecialty!: OperatorSpecialties; // CAMBIADO el tipo
  theFormGroup!: FormGroup;
  trySend: boolean = false;

  constructor(
    private activateRoute: ActivatedRoute,
    private operatorSpecialtyService: Operator_specialtyService, // CAMBIADO el servicio
    private router: Router,
    private fb: FormBuilder
  ) {
    this.operatorSpecialty = {}; // Inicializar vacío o con valores por defecto si es necesario
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

    if ((this.mode === 1 || this.mode === 3) && idFromRoute) {
      this.getOperatorSpecialty(+idFromRoute); // CAMBIADO el nombre del método
    } else if (this.mode === 1) {
      // Si es modo vista sin ID (improbable con rutas correctas), o para asegurar deshabilitación
      if (this.theFormGroup) this.theFormGroup.disable();
    }
    // En modo creación, el formulario ya está configurado y vacío.
  }

  configFormGroup() {
    this.theFormGroup = this.fb.group({
      operator_id: [
        // Para 'update', el valor inicial vendrá de patchValue. Para 'create', será null.
        { value: null, disabled: false },
        [Validators.required, Validators.min(1)]
      ],
      specialty_id: [
        { value: null, disabled: false },
        [Validators.required, Validators.min(1)]
      ],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]]
    }, { validators: this.dateRangeValidator }); // Validador a nivel de grupo
  }

  // Validador personalizado para asegurar que end_date no sea anterior a start_date
  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const startDate = group.get('start_date')?.value;
    const endDate = group.get('end_date')?.value;
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  getOperatorSpecialty(id: number) { // CAMBIADO el nombre del método
    this.operatorSpecialtyService.view(id).subscribe({
      next: (responseData) => {
        // IMPORTANTE: Ajusta esto según la estructura REAL de la respuesta de tu servicio
        // Si tu servicio devuelve { "OperatorSpecialty": { ...datos... } }
        // const data = responseData.OperatorSpecialty;
        // Si tu servicio devuelve directamente { ...datos... }
        const data = responseData;

        if (data) {
          this.operatorSpecialty = data;

          // El input de tipo 'date' espera 'YYYY-MM-DD'
          // Si start_date o end_date vienen del backend en otro formato (ej. ISO con hora), hay que formatear.
          const formattedStartDate = data.start_date ? new Date(data.start_date).toISOString().split('T')[0] : '';
          const formattedEndDate = data.end_date ? new Date(data.end_date).toISOString().split('T')[0] : '';

          this.theFormGroup.patchValue({
            operator_id: this.operatorSpecialty.operator_id,
            specialty_id: this.operatorSpecialty.specialty_id,
            start_date: formattedStartDate,
            end_date: formattedEndDate
          });

          if (this.mode === 1) { // Modo Vista
            this.theFormGroup.disable();
          } else if (this.mode === 3) { // Modo Actualización
            // Generalmente, los IDs de relación no se cambian, se crea una nueva relación.
            // Decide si estos campos deben ser deshabilitados en modo actualización.
            if (this.formControls.operator_id) this.formControls.operator_id.disable();
            if (this.formControls.specialty_id) this.formControls.specialty_id.disable();
          }
        } else {
          Swal.fire('Error', 'La respuesta del servidor no tiene el formato esperado para la asignación.', 'error');
          this.router.navigate(['/operatorSpecialties/list']); // CAMBIAR RUTA si es necesario
        }
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo cargar la asignación de especialidad.';
        Swal.fire('Error', errorMessage, 'error');
        this.router.navigate(['/operatorSpecialties/list']); // CAMBIAR RUTA si es necesario
      }
    });
  }

  get formControls() {
    return this.theFormGroup.controls;
  }

  back() {
    this.router.navigate(['/operatorSpecialties/list']); // CAMBIAR RUTA si es necesario
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos requeridos correctamente y asegúrese que las fechas son válidas.', 'error');
      Object.values(this.formControls).forEach(control => control.markAsTouched());
      return;
    }

    const formValues = this.theFormGroup.value;
    const dataToCreate: OperatorSpecialties = {
      // id es generado por el backend
      operator_id: +formValues.operator_id, // Convertir a número
      specialty_id: +formValues.specialty_id, // Convertir a número
      start_date: formValues.start_date,
      end_date: formValues.end_date
    };

    this.operatorSpecialtyService.create(dataToCreate).subscribe({
      next: () => {
        Swal.fire('Creado', "Asignación de especialidad creada correctamente.", 'success');
        this.router.navigate(['/operatorSpecialties/list']); // CAMBIAR RUTA si es necesario
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo crear la asignación.';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  update() {
    this.trySend = true;
    let formIsValid = true; // Re-evaluar para update
    Object.keys(this.formControls).forEach(key => {
      const control = this.formControls[key];
      if (control.enabled && control.invalid) { // Solo validar controles habilitados
        formIsValid = false;
        control.markAsTouched();
      }
    });
     // Chequear también los errores a nivel de grupo (como dateRangeValidator)
    if (this.theFormGroup.errors) {
        formIsValid = false;
    }

    if (!formIsValid) {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos editables requeridos correctamente y asegúrese que las fechas son válidas.', 'error');
      return;
    }

    const formValues = this.theFormGroup.getRawValue(); // getRawValue para incluir campos deshabilitados

    const dataToUpdate: Partial<OperatorSpecialties> = {
      id: this.operatorSpecialty.id, // El ID viene del objeto cargado, no del formulario
      operator_id: +formValues.operator_id, // Tomar de formValues (raw)
      specialty_id: +formValues.specialty_id, // Tomar de formValues (raw)
      start_date: formValues.start_date,
      end_date: formValues.end_date,
    };

    this.operatorSpecialtyService.update(dataToUpdate as OperatorSpecialties).subscribe({
      next: () => {
        Swal.fire('Actualizado', "Asignación de especialidad actualizada correctamente.", 'success');
        this.router.navigate(['/operatorSpecialties/list']); // CAMBIAR RUTA si es necesario
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo actualizar la asignación.';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }
}
