import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // AbstractControl y ValidationErrors no son necesarios aquí si no hay validadores de grupo
import Swal from 'sweetalert2';

import { Insurance } from 'src/app/models/insurance.model'; // CAMBIADO
import { InsuranceService } from 'src/app/services/insurance.service'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-manage-insurance', // Cambia si es necesario para tu estructura
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit { // Puedes renombrar la clase si tienes otro ManageComponent

  mode: number = 1; // 1 - view, 2 - create, 3 - update
  insurance!: Insurance; // CAMBIADO el tipo
  theFormGroup!: FormGroup;
  trySend: boolean = false;

  constructor(
    private activateRoute: ActivatedRoute,
    private insuranceService: InsuranceService, // CAMBIADO el servicio
    private router: Router,
    private fb: FormBuilder
  ) {
    this.insurance = {}; // Inicializar vacío o con valores por defecto si es necesario
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
      this.getinsurance(+idFromRoute); // CAMBIADO el nombre del método
    } else if (this.mode === 1) {
      if (this.theFormGroup) this.theFormGroup.disable();
    }
  }

  configFormGroup() {
    this.theFormGroup = this.fb.group({
      type: ['', [Validators.required, Validators.maxLength(100)]], // Ajusta maxLength según necesites
      company: ['', [Validators.required, Validators.maxLength(150)]] // Ajusta maxLength según necesites
    });
    // No se necesita validador de grupo para este modelo simple
  }

  getinsurance(id: number) { // CAMBIADO el nombre del método
    this.insuranceService.view(id).subscribe({ // Asume que el servicio tiene un método view(id)
      next: (responseData) => {
        // IMPORTANTE: Ajusta esto según la estructura REAL de la respuesta de tu servicio
        // Si tu servicio devuelve { "insurance": { ...datos... } } -> const data = responseData.insurance;
        // Si tu servicio devuelve directamente { ...datos... } -> const data = responseData;
        const data = responseData; // ASUMIENDO respuesta directa

        if (data) {
          this.insurance = data;

          this.theFormGroup.patchValue({
            type: this.insurance.type,
            company: this.insurance.company
          });

          if (this.mode === 1) { // Modo Vista
            this.theFormGroup.disable();
          }
          // No hay campos que deshabilitar específicamente en modo update para este modelo simple
          // a menos que tengas reglas de negocio específicas.
        } else {
          Swal.fire('Error', 'La respuesta del servidor no tiene el formato esperado para la aseguradora.', 'error');
          this.router.navigate(['/insurances/list']); // CAMBIAR RUTA base si es necesario
        }
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo cargar la aseguradora.';
        Swal.fire('Error', errorMessage, 'error');
        this.router.navigate(['/insurances/list']); // CAMBIAR RUTA base si es necesario
      }
    });
  }

  get formControls() {
    return this.theFormGroup.controls;
  }

  back() {
    this.router.navigate(['/insurances/list']); // CAMBIAR RUTA base si es necesario
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos requeridos correctamente.', 'error');
      Object.values(this.formControls).forEach(control => control.markAsTouched());
      return;
    }

    const formValues = this.theFormGroup.value;
    const dataToCreate: Insurance = {
      // id es generado por el backend
      type: formValues.type,
      company: formValues.company
    };

    this.insuranceService.create(dataToCreate).subscribe({ // Asume que el servicio tiene un método create()
      next: () => {
        Swal.fire('Creado', "Aseguradora creada correctamente.", 'success');
        this.router.navigate(['/insurances/list']); // CAMBIAR RUTA base si es necesario
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo crear la aseguradora.';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid) { // Para este modelo simple, la validación es la misma que en create
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos editables requeridos correctamente.', 'error');
      Object.values(this.formControls).forEach(control => control.markAsTouched());
      return;
    }

    const formValues = this.theFormGroup.value; // getRawValue no es necesario si no hay campos deshabilitados que quieras enviar

    const dataToUpdate: Insurance = { // Usar insurance, no Partial, si envías todos los campos editables
      id: this.insurance.id, // El ID viene del objeto cargado, no del formulario
      type: formValues.type,
      company: formValues.company,
    };

    this.insuranceService.update(dataToUpdate).subscribe({ // Asume que el servicio tiene un método update()
      next: () => {
        Swal.fire('Actualizado', "Aseguradora actualizada correctamente.", 'success');
        this.router.navigate(['/insurances/list']); // CAMBIAR RUTA base si es necesario
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo actualizar la aseguradora.';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }
}
