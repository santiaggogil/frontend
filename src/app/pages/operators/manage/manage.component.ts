import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { Operator } from 'src/app/models/operator.model'; // Asegúrate que el path sea correcto
import { OperatorService } from 'src/app/services/operator.service'; // Asegúrate que el path sea correcto

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number = 1; // 1 - view, 2 - create, 3 - update (default to view)
  operator!: Operator; // Usar "!" o inicializar con una estructura básica si prefieres
  theFormGroup!: FormGroup;
  trySend: boolean = false;

  constructor(
    private activateRoute: ActivatedRoute,
    private operatorService: OperatorService,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Inicializar operator con una estructura básica para evitar errores de undefined antes de la carga
    this.operator = { id: 0, user_id: '', phone: '', identification: 0, Operator: {} as Operator };
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

    const operatorIdFromRoute = this.activateRoute.snapshot.params['id'];

    if ((this.mode === 1 || this.mode === 3) && operatorIdFromRoute) {
      this.getoperator(+operatorIdFromRoute); // Convertir a número y llamar
    } else if (this.mode === 1) {
      this.theFormGroup.disable();
    }
    // Para el modo creación (mode === 2), el formulario ya está configurado y vacío.
  }

  configFormGroup() {
    this.theFormGroup = this.fb.group({
      user_id: [ // Valor inicial vacío, se poblará desde getoperator
        { value: '', disabled: false }, // Empezar habilitado, se deshabilita en modo update
        [
          Validators.required,
          Validators.maxLength(255) // O el validador de formato UUID si user_id es un UUID
        ]
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\+?\d{7,15}$/) // Ejemplo de patrón de número móvil internacional
        ]
      ],
      identification: [ // Valor inicial como string, se convertirá a número al enviar
        '',
        [
          Validators.required,
          Validators.min(1), // Para números positivos (sin incluir cero si así lo quieres)
          Validators.pattern(/^\d+$/) // Asegurar que solo sean dígitos
        ]
      ]
    });
  }

  getoperator(id: number) {
    this.operatorService.view(id).subscribe({
      next: (responseData) => { // responseData es { Operator: {...}, user: null/object }
        console.log("Raw data from service on getoperator:", responseData);

        if (responseData && responseData.Operator) {
          this.operator = responseData.Operator; // Asignar la parte del Operador

          // Opcional: Si quieres almacenar los detalles del usuario (aunque sean null)
          // this.operator.userDetails = responseData.user; // Necesitarías añadir userDetails al modelo Operator

          console.log("Assigned this.operator:", this.operator);

          this.theFormGroup.patchValue({
            user_id: this.operator.user_id,
            phone: this.operator.phone,
            identification: this.operator.identification // patchValue puede manejar number a string en input
          });

          if (this.mode === 1) { // Modo Vista
            this.theFormGroup.disable();
          } else if (this.mode === 3) { // Modo Actualización
            if (this.formControls.user_id) {
              this.formControls.user_id.disable(); // Deshabilitar el campo user_id
            }
          }
        } else {
          console.error("Error: responseData.Operator is undefined", responseData);
          Swal.fire('Error', 'La respuesta del servidor no tiene el formato esperado para el Operador.', 'error');
          this.router.navigate(['/operators/list']);
        }
      },
      error: (err) => {
        console.error("Error fetching operator", err);
        const errorMessage = err.error?.message || 'No se pudo cargar el operario.';
        Swal.fire('Error', errorMessage, 'error');
        this.router.navigate(['/operators/list']);
      }
    });
  }

  get formControls() {
    return this.theFormGroup.controls;
  }

  back() {
    this.router.navigate(['/operators/list']);
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos requeridos correctamente.', 'error');
      Object.values(this.formControls).forEach(control => control.markAsTouched());
      return;
    }

    const formValues = this.theFormGroup.value;
    const dataToCreate: Operator = {
      ...formValues,
      identification: formValues.identification ? +formValues.identification : null,
      // id se genera en el backend
    };
    // Elimina id si está presente por error en formValues para la creación
    delete dataToCreate.id;


    console.log('Data being sent for create:', JSON.stringify(dataToCreate, null, 2));

    this.operatorService.create(dataToCreate).subscribe({
      next: () => {
        Swal.fire('Creado', "Operario creado correctamente", 'success'); // Corregido "creada"
        this.router.navigate(['/operators/list']);
      },
      error: (err) => {
        console.error("Error creating operator", err);
        const errorMessage = err.error?.message || 'No se pudo crear el operario.';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  update() {
    this.trySend = true;
    // Validar solo los controles habilitados
    let formIsValid = true;
    Object.keys(this.formControls).forEach(key => {
      const control = this.formControls[key];
      if (control.enabled && control.invalid) {
        formIsValid = false;
        control.markAsTouched();
      }
    });

    if (!formIsValid) {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos editables requeridos correctamente.', 'error');
      return;
    }

    const formValues = this.theFormGroup.getRawValue(); // Obtiene todos los valores, incl. deshabilitados

    const dataToUpdate: Partial<Operator> = { // Usar Partial o un DTO específico para update
      id: this.operator.id,       // ID del operador cargado, NO del formulario
      user_id: formValues.user_id, // user_id del formulario (que fue poblado y deshabilitado)
                                  // o this.operator.user_id si prefieres el valor original siempre
      phone: formValues.phone,
      identification: formValues.identification ? +formValues.identification : null, // Convertir a número
    };

    console.log('Data being sent for update:', JSON.stringify(dataToUpdate, null, 2));

    this.operatorService.update(dataToUpdate as Operator).subscribe({ // Cast a Operator si el servicio lo espera
      next: () => {
        Swal.fire('Actualizado', "Operario actualizado correctamente", 'success');
        this.router.navigate(['/operators/list']);
      },
      error: (err) => {
        console.error("Error updating operator", err);
        const errorMessage = err.error?.message || 'No se pudo actualizar el operario.';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }
}
