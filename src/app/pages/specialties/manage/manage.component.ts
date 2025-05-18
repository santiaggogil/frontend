import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // FormControl no es necesario si usas FormBuilder para todo
import Swal from 'sweetalert2';

import { Specialty } from 'src/app/models/specialty.model';
import { SpecialtyService } from 'src/app/services/specialty.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number = 1; // 1 - view, 2 - create, 3 - update (default to view)
  specialty: Specialty;
  theFormGroup!: FormGroup; // Usar "!" para indicar que se inicializará en constructor/ngOnInit
  trySend: boolean = false;

  constructor(
    private activateRoute: ActivatedRoute,
    private specialtyService: SpecialtyService,
    private router: Router,
    private fb: FormBuilder // Renombrado a fb para convención (FormBuilder)
  ) {
    this.specialty = { id: 0, name: '', description: '' }; // Inicializar con estructura completa
    this.configFormGroup(); // Inicializar la estructura del formulario
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

    // Si es modo vista o actualización, y hay un ID, obtener los datos
    if ((this.mode === 1 || this.mode === 3) && this.activateRoute.snapshot.params['id']) {
      this.specialty.id = +this.activateRoute.snapshot.params['id']; // Convertir a número con el +
      this.getSpecialty(this.specialty.id);
    } else if (this.mode === 1) { // Si es modo vista pero no hay ID (aunque no debería pasar con rutas bien definidas)
        this.theFormGroup.disable(); // Deshabilitar si es solo vista
    }
    // Para el modo creación, el formulario ya está configurado y vacío
  }

  configFormGroup() {
    this.theFormGroup = this.fb.group({
      name: [
        '', // Valor inicial
        [
          Validators.required,
          Validators.minLength(3), // Ajustado para un nombre típico
          Validators.maxLength(100),
          // Validators.pattern('^[a-zA-Z ]*$') // Ejemplo: solo letras y espacios, si es necesario
        ]
      ],
      description: [
        '', // Valor inicial
        [
          Validators.required,
          Validators.minLength(5), // Ajustado para una descripción
          Validators.maxLength(250), // Ajustado
          // Validators.pattern('^[a-zA-Z0-9 .,]*$') // Ejemplo: alfanumérico, puntos, comas, espacios
        ]
      ]
    });
  }

  getSpecialty(id: number) {
    this.specialtyService.view(id).subscribe({
      next: (data) => {
        this.specialty = data;
        // Poblar el formulario con los datos de la especialidad
        this.theFormGroup.patchValue({
          name: this.specialty.name,
          description: this.specialty.description
        });
        if (this.mode === 1) {
          this.theFormGroup.disable(); // Deshabilitar todo el formulario en modo vista
        }
        console.log("Specialty fetched successfully", this.specialty);
      },
      error: (error) => {
        console.error("Error fetching specialty", error);
        Swal.fire('Error', 'No se pudo cargar la especialidad.', 'error');
        this.router.navigate(['/specialties/list']); // Redirigir si hay error
      }
    });
  }

  get formControls() { // Getter más corto para acceder a los controles en el HTML
    return this.theFormGroup.controls;
  }

  back() {
    this.router.navigate(['/specialties/list']);
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos requeridos correctamente.', 'error');
      // Marcar todos como tocados para mostrar errores
      Object.values(this.theFormGroup.controls).forEach(control => control.markAsTouched());
      return;
    }

    const dataToCreate: Specialty = this.theFormGroup.value;

    this.specialtyService.create(dataToCreate).subscribe({
      next: () => { // No necesitamos la respuesta 'specialty' aquí usualmente
        Swal.fire('Creado', "Especialidad creada correctamente", 'success');
        this.router.navigate(['/specialties/list']);
      },
      error: (error) => {
        console.error("Error creating specialty", error);
        Swal.fire('Error', 'No se pudo crear la especialidad.', 'error');
      }
    });
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos requeridos correctamente.', 'error');
      Object.values(this.theFormGroup.controls).forEach(control => control.markAsTouched());
      return;
    }

    // Combinar los datos del formulario con el ID existente
    const dataToUpdate: Specialty = {
      ...this.theFormGroup.value, // toma name, description del formulario
      id: this.specialty.id       // añade el id que ya teníamos
    };

    this.specialtyService.update(dataToUpdate).subscribe({
      next: () => {
        Swal.fire('Actualizado', "Especialidad actualizada correctamente", 'success');
        this.router.navigate(['/specialties/list']);
      },
      error: (error) => {
        console.error("Error updating specialty", error);
        Swal.fire('Error', 'No se pudo actualizar la especialidad.', 'error');
      }
    });
  }
}
