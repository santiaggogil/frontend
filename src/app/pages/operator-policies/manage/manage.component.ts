// src/app/components/operator-policies/manage/manage.component.ts (ajusta la ruta)
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { OperatorPolicy } from 'src/app/models/operator-policy.model';
import { OperatorPolicyervice } from 'src/app/services/operator-policy.service'; // ajusta la ruta si es diferente

@Component({
  selector: 'app-manage-operator-policy', // Selector actualizado
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit { // Nombre de clase actualizado

  mode: number = 1; // 1 - view, 2 - create, 3 - update
  operatorPolicy!: OperatorPolicy;
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  currentId?: number;

  constructor(
    private activateRoute: ActivatedRoute,
    private operatorPolicyService: OperatorPolicyervice, // Asegúrate de que la ruta sea correcta
    // private operatorPolicyService: OperatorPolicyService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.operatorPolicy = {} as OperatorPolicy; // Inicializar como tipo base
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
      this.getOperatorPolicy(this.currentId);
    } else if (this.mode === 1) {
      if (this.theFormGroup) this.theFormGroup.disable();
    }
  }

  configFormGroup() {
    this.theFormGroup = this.fb.group({
      operator_id: [null, [Validators.required, Validators.min(1)]],
      insurance_id: [null, [Validators.required, Validators.min(1)]],
      insured_value: [null, [Validators.required, Validators.min(0)]],
      valid_from: ['', [Validators.required]],
      valid_to: ['', [Validators.required]]
    }, { validators: this.dateRangeValidator });
  }

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const startDate = group.get('valid_from')?.value;
    const endDate = group.get('valid_to')?.value;
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  getOperatorPolicy(id: number) {
    this.operatorPolicyService.view(id).subscribe({
      next: (responseData) => {
        if (responseData) {
          this.operatorPolicy = responseData;
          const formattedValidFrom = responseData.valid_from ? new Date(responseData.valid_from).toISOString().split('T')[0] : '';
          const formattedValidTo = responseData.valid_to ? new Date(responseData.valid_to).toISOString().split('T')[0] : '';

          this.theFormGroup.patchValue({
            operator_id: this.operatorPolicy.operator_id,
            insurance_id: this.operatorPolicy.insurance_id,
            insured_value: this.operatorPolicy.insured_value,
            valid_from: formattedValidFrom,
            valid_to: formattedValidTo
          });

          if (this.mode === 1) {
            this.theFormGroup.disable();
          } else if (this.mode === 3) {
            // Podrías deshabilitar IDs si no deben ser editables en actualización
            // this.formControls.operator_id?.disable();
            // this.formControls.insurance_id?.disable();
          }
        } else {
          Swal.fire('Error', 'La respuesta del servidor no tiene el formato esperado para la póliza.', 'error');
          this.router.navigate(['/operatorPolicies/list']);
        }
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo cargar la póliza de operario.';
        Swal.fire('Error', errorMessage, 'error');
        this.router.navigate(['/operatorPolicies/list']);
      }
    });
  }

  get formControls() {
    return this.theFormGroup.controls;
  }

  back() {
    this.router.navigate(['/operatorPolicies/list']);
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos requeridos correctamente y asegúrese que las fechas son válidas.', 'error');
      Object.values(this.formControls).forEach(control => control.markAsTouched());
      if (this.theFormGroup.errors?.dateRangeInvalid) { // Marcar campos de fecha si hay error de rango
        this.formControls.valid_from.markAsTouched();
        this.formControls.valid_to.markAsTouched();
      }
      return;
    }

    const dataToCreate: OperatorPolicy = {
      ...this.theFormGroup.value,
      operator_id: +this.theFormGroup.value.operator_id,
      insurance_id: +this.theFormGroup.value.insurance_id,
      insured_value: +this.theFormGroup.value.insured_value
    };

    this.operatorPolicyService.create(dataToCreate).subscribe({
      next: () => {
        Swal.fire('Creada', "Póliza de operario creada correctamente.", 'success');
        this.router.navigate(['/operatorPolicies/list']);
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo crear la póliza.';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  update() {
    this.trySend = true;
    let formIsValid = true;
    Object.keys(this.formControls).forEach(key => {
      const control = this.formControls[key];
      if (control.enabled && control.invalid) {
        formIsValid = false;
        control.markAsTouched();
      }
    });
    if (this.theFormGroup.errors) {
        formIsValid = false;
        if (this.theFormGroup.errors.dateRangeInvalid) { // Marcar campos de fecha si hay error de rango
            this.formControls.valid_from.markAsTouched();
            this.formControls.valid_to.markAsTouched();
        }
    }

    if (!formIsValid) {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos editables requeridos correctamente y asegúrese que las fechas son válidas.', 'error');
      return;
    }

    const formValues = this.theFormGroup.getRawValue();
    const dataToUpdate: OperatorPolicy = {
      id: this.operatorPolicy.id, // Es crucial incluir el ID para la actualización
      operator_id: +formValues.operator_id,
      insurance_id: +formValues.insurance_id,
      insured_value: +formValues.insured_value,
      valid_from: formValues.valid_from,
      valid_to: formValues.valid_to,
    };

    this.operatorPolicyService.update(dataToUpdate).subscribe({
      next: () => {
        Swal.fire('Actualizada', "Póliza de operario actualizada correctamente.", 'success');
        this.router.navigate(['/operatorPolicies/list']);
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo actualizar la póliza.';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }
}
