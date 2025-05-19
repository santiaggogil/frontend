// src/app/components/gps/manage/manage.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { Gps } from 'src/app/models/gps.model';        // Modelo Gps
import { GpsService } from 'src/app/services/gps.service';  // Servicio Gps
import { Machine } from 'src/app/models/machine.model';   // Modelo Machine para el select
import { MachineService } from 'src/app/services/machine.service'; // Servicio Machine para el select

@Component({
  selector: 'app-manage-gps', // Selector para Gps
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'] // Asumiendo un SCSS similar
})
export class ManageGpsComponent implements OnInit {

  mode: number = 1; // 1 - view, 2 - create, 3 - update
  gps!: Gps;       // Objeto para los datos del Gps
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  currentId?: number;

  machinesForSelection: Machine[] = []; // Array para las opciones del select de máquinas

  constructor(
    private activateRoute: ActivatedRoute,
    private gpsService: GpsService,             // Servicio de Gps
    private machineService: MachineService,     // Servicio de Machine
    private router: Router,
    private fb: FormBuilder
  ) {
    this.gps = {} as Gps; // Inicializar gps
    // this.configFormGroup(); // Se llamará en ngOnInit después de determinar el modo
  }

  ngOnInit(): void {
    this.configFormGroup(); // Configurar el formulario primero

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

    // Cargar máquinas para el select
    if (this.mode !== 1 || (this.mode === 1 && this.currentId)) { // Cargar si no es vista, o si es vista y hay un ID (para mostrar nombre)
        this.loadMachinesForSelect();
    }


    if ((this.mode === 1 || this.mode === 3) && this.currentId) {
      this.getGps(this.currentId);
    } else if (this.mode === 1 && !this.currentId) { // Modo vista sin ID (improbable, pero por si acaso)
        if (this.theFormGroup) this.theFormGroup.disable();
    } else if (this.mode === 2) { // Modo creación
        // Puedes establecer valores por defecto si es necesario
        // Por ejemplo, que el select de máquina esté en "Seleccione"
        this.theFormGroup.patchValue({ machine_id: null });
    }
  }

  configFormGroup() {
    const currentYear = new Date().getFullYear();
    this.theFormGroup = this.fb.group({
      // 'name' no existe en el modelo Gps
      brand: ['', [Validators.required, Validators.maxLength(100)]],
      model: ['', [Validators.required, Validators.maxLength(100)]],
      year: [null, [
          Validators.required,
          Validators.min(1980), // Año mínimo razonable para GPS
          Validators.max(currentYear + 3), // Año máximo razonable
          Validators.pattern(/^\d{4}$/)
        ]
      ],
      machine_id: [null, [Validators.required]] // Para el select, null como valor inicial
    });
  }

  loadMachinesForSelect(): void {
    this.machineService.list().subscribe({
      next: (data) => {
        this.machinesForSelection = data;
        // Si estamos editando y el GPS ya tiene una máquina, y las máquinas ya se cargaron,
        // el patchValue en getGps se encargará de seleccionarla.
      },
      error: (error) => {
        console.error("Error loading machines for selection", error);
        Swal.fire('Error', 'No se pudieron cargar las máquinas para la selección.', 'error');
      }
    });
  }

  getGps(id: number) {
    this.gpsService.view(id).subscribe({ // Usar gpsService y el modelo Gps
      next: (responseData) => {
        if (responseData) {
          this.gps = responseData;
          this.theFormGroup.patchValue({
            brand: this.gps.brand,
            model: this.gps.model,
            year: this.gps.year,
            machine_id: this.gps.machine_id // El valor de machine_id debería coincidir con una opción del select
          });

          if (this.mode === 1) {
            this.theFormGroup.disable(); // Deshabilitar todo el formulario en modo vista
          }
        } else {
          Swal.fire('Error', 'La respuesta del servidor no tiene el formato esperado para el GPS.', 'error');
          this.router.navigate(['/gps/list']); // Redirigir a la lista de GPS
        }
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo cargar el GPS.';
        Swal.fire('Error', errorMessage, 'error');
        this.router.navigate(['/gps/list']); // Redirigir a la lista de GPS
      }
    });
  }

  get formControls() {
    return this.theFormGroup.controls;
  }

  back() {
    this.router.navigate(['/gps/list']); // Redirigir a la lista de GPS
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos requeridos correctamente.', 'error');
      Object.values(this.formControls).forEach(control => {
        if(control.invalid) control.markAsTouched();
      });
      return;
    }

    const formValues = this.theFormGroup.value;
    const dataToCreate: Gps = {
      // id es generado por el backend
      brand: formValues.brand,
      model: formValues.model,
      year: +formValues.year,
      machine_id: formValues.machine_id !== null ? +formValues.machine_id : undefined
    };

    this.gpsService.create(dataToCreate).subscribe({ // Usar gpsService
      next: () => {
        Swal.fire('Creado', "GPS creado correctamente.", 'success');
        this.router.navigate(['/gps/list']); // Redirigir a la lista de GPS
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo crear el GPS.';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos editables requeridos correctamente.', 'error');
      Object.values(this.formControls).forEach(control => {
        if(control.invalid) control.markAsTouched();
      });
      return;
    }

    if (!this.gps || this.gps.id === undefined) {
        Swal.fire('Error', 'No se puede actualizar un GPS sin ID.', 'error');
        return;
    }

    const formValues = this.theFormGroup.value;
    const dataToUpdate: Gps = {
      id: this.gps.id, // El ID viene del objeto cargado
      brand: formValues.brand,
      model: formValues.model,
      year: +formValues.year,
      machine_id: formValues.machine_id !== null ? +formValues.machine_id : undefined
    };

    this.gpsService.update(dataToUpdate).subscribe({ // Usar gpsService
      next: () => {
        Swal.fire('Actualizado', "GPS actualizado correctamente.", 'success');
        this.router.navigate(['/gps/list']); // Redirigir a la lista de GPS
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo actualizar el GPS.';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }
}
