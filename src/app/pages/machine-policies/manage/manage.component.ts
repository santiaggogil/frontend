import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { MachinePolicy } from 'src/app/models/machine-policy.model'; // CAMBIO: Modelo importado
import { MachinePolicyService } from 'src/app/services/machine-policy.service'; // CAMBIO: Servicio importado (asegúrate que exista y la ruta sea correcta)

@Component({
  selector: 'app-manage-machine-policy', // CAMBIO: Selector
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageMachinePolicyComponent implements OnInit { // CAMBIO: Nombre de clase

  mode: number = 1; // 1 - view, 2 - create, 3 - update
  machinePolicy!: MachinePolicy; // CAMBIO: Nombre de variable y tipo
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  currentId?: number;

  constructor(
    private activateRoute: ActivatedRoute,
    private machinePolicyService: MachinePolicyService, // CAMBIO: Servicio inyectado
    private router: Router,
    private fb: FormBuilder
  ) {
    this.machinePolicy = {} as MachinePolicy; // CAMBIO: Inicializar como tipo base
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
      this.getMachinePolicy(this.currentId); // CAMBIO: Llamada a método
    } else if (this.mode === 1) { // Si es modo vista y no hay ID (aunque no debería pasar si la ruta está bien), o si es modo creación
        if (this.theFormGroup) this.theFormGroup.disable(); // Deshabilitar solo en modo vista
    }
  }

  configFormGroup() {
    this.theFormGroup = this.fb.group({
      machine_id: [null, [Validators.required, Validators.min(1)]], // CAMBIO: Nombre de control
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

  getMachinePolicy(id: number) { // CAMBIO: Nombre del método
    this.machinePolicyService.view(id).subscribe({ // CAMBIO: Llamada al servicio
      next: (responseData) => {
        const data = responseData;
        if (data) {
          this.machinePolicy = data; // CAMBIO: Asignación a variable
          const formattedValidFrom = data.valid_from ? new Date(data.valid_from).toISOString().split('T')[0] : '';
          const formattedValidTo = data.valid_to ? new Date(data.valid_to).toISOString().split('T')[0] : '';

          this.theFormGroup.patchValue({
            machine_id: this.machinePolicy.machine_id, // CAMBIO: Propiedad del modelo
            insurance_id: this.machinePolicy.insurance_id,
            insured_value: this.machinePolicy.insured_value,
            valid_from: formattedValidFrom,
            valid_to: formattedValidTo
          });

          if (this.mode === 1) {
            this.theFormGroup.disable();
          } else if (this.mode === 3) {
            // Podrías deshabilitar IDs si no deben ser editables en actualización
            // this.formControls.machine_id?.disable();
            // this.formControls.insurance_id?.disable();
          }
        } else {
          Swal.fire('Error', 'La respuesta del servidor no tiene el formato esperado para la póliza.', 'error');
          this.router.navigate(['/machinePolicies/list']); // CAMBIO: Ruta
        }
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo cargar la póliza de máquina.'; // CAMBIO: Mensaje
        Swal.fire('Error', errorMessage, 'error');
        this.router.navigate(['/machinePolicies/list']); // CAMBIO: Ruta
      }
    });
  }

  get formControls() {
    return this.theFormGroup.controls;
  }

  back() {
    this.router.navigate(['/machinePolicies/list']); // CAMBIO: Ruta
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos requeridos correctamente y asegúrese que las fechas son válidas.', 'error');
      Object.values(this.formControls).forEach(control => control.markAsTouched());
      if (this.theFormGroup.errors?.dateRangeInvalid) {
        this.formControls.valid_from.markAsTouched();
        this.formControls.valid_to.markAsTouched();
      }
      return;
    }

    const dataToCreate: MachinePolicy = { // CAMBIO: Tipo
      ...this.theFormGroup.value,
      machine_id: +this.theFormGroup.value.machine_id, // CAMBIO: Propiedad y parseo
      insurance_id: +this.theFormGroup.value.insurance_id,
      insured_value: +this.theFormGroup.value.insured_value
    };

    this.machinePolicyService.create(dataToCreate).subscribe({ // CAMBIO: Llamada al servicio
      next: () => {
        Swal.fire('Creada', "Póliza de máquina creada correctamente.", 'success'); // CAMBIO: Mensaje
        this.router.navigate(['/machinePolicies/list']); // CAMBIO: Ruta
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
    // Chequear validez de controles habilitados
    Object.keys(this.formControls).forEach(key => {
      const control = this.formControls[key];
      if (control.enabled && control.invalid) {
        formIsValid = false;
        control.markAsTouched();
      }
    });
    // Chequear errores a nivel de grupo (como dateRangeInvalid)
    if (this.theFormGroup.errors) {
        formIsValid = false;
        if (this.theFormGroup.errors.dateRangeInvalid) {
            this.formControls.valid_from.markAsTouched();
            this.formControls.valid_to.markAsTouched();
        }
    }

    if (!formIsValid) {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos editables requeridos correctamente y asegúrese que las fechas son válidas.', 'error');
      return;
    }

    const formValues = this.theFormGroup.getRawValue(); // getRawValue para obtener valores de controles deshabilitados también (si los hubiera)
    const dataToUpdate: MachinePolicy = { // CAMBIO: Tipo
      id: this.machinePolicy.id, // Es crucial incluir el ID para la actualización
      machine_id: +formValues.machine_id, // CAMBIO: Propiedad y parseo
      insurance_id: +formValues.insurance_id,
      insured_value: +formValues.insured_value,
      valid_from: formValues.valid_from,
      valid_to: formValues.valid_to,
    };

    this.machinePolicyService.update(dataToUpdate).subscribe({ // CAMBIO: Llamada al servicio
      next: () => {
        Swal.fire('Actualizada', "Póliza de máquina actualizada correctamente.", 'success'); // CAMBIO: Mensaje
        this.router.navigate(['/machinePolicies/list']); // CAMBIO: Ruta
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo actualizar la póliza.';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }
}
