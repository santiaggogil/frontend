import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Specialty } from 'src/app/models/specialty.model';
import { SpecialtyService } from 'src/app/services/specialty.service'; // AÑADE ESTA LÍNEA
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; //1 - view, 2 - create, 3 - update
  specialty: Specialty;
  theFormGroup: FormGroup; //policia del formulario
  trySend: boolean; // variable para controlar el envío del formulario

  constructor(private activateRoute:ActivatedRoute, private specialtyService: SpecialtyService, private router:Router, private theFormBuilder: FormBuilder) { // inyeccion de activatedRoute para obtener la url activa en el navegador, esto toma 'fotos'// inyeccion de activatedRoute para obtener la url activa en el navegador, esto toma 'fotos'
    this.specialty={id:0}; // inicializa el objeto specialty
    this.configFormGroup(); // inicializa el formulario
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
    if (this.activateRoute.snapshot.params.id) { //esto es para traer el id de la url
      this.specialty.id = this.activateRoute.snapshot.params.id
      this.getSpecialty(this.specialty.id)
    }
      this.configFormGroup(); //AHORA se llama en el momento correcto
  }

  getSpecialty(id: number) {
    this.specialtyService.view(id).subscribe({
      next: (specialty) => {
        this.specialty = specialty;
        // Actualizar formulario con los datos recibidos
       this.theFormGroup.patchValue({
        name: specialty.name,
        description: specialty.description
      });
      console.log("Specialty fetched successfully", this.specialty);
    },
      error: (error) => {
        console.error("Error fetching specialty", error);
      }
    });
  }


  // configFormGroup() { //metodo para definir las reglas
  //   this.theFormGroup = this.theFormBuilder.group({
  //     // primer elemento del vector, valor por defecto
  //     // lista, serán las reglas
  //     name: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
  //     region: ['', [Validators.required, Validators.minLength(2)]]
  //   })
  // }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      name: [
        '',
        [
          Validators.required,              // campo obligatorio
          Validators.minLength(2),          // mínimo 2 caracteres
          Validators.maxLength(100),        // máximo 100 caracteres
          Validators.pattern('.*') // solo letras y espacios
        ]
      ],
      description: [
        '',
        [
          Validators.required,              // campo obligatorio
          Validators.minLength(2),          // mínimo 2 caracteres
          Validators.maxLength(50),         // máximo 50 caracteres
          Validators.pattern('.*') // solo letras y espacios
        ]
      ]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls
  }

  back() {
    this.router.navigate(['/specialties/list']);
  }

  create() {
    this.trySend = true; // se activa el envío del formulario
    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, complete todos los campos requeridos.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      })
      return
    }

    const data = this.theFormGroup.value;

    this.specialtyService.create(data).subscribe({
      next: (specialty) => {
        console.log("specialty created successfully", specialty);
        Swal.fire({
          title: 'Creado',
          text: "Estado creado correctamente",
          icon: 'success',
        });
        this.router.navigate(['/specialties/list']);
      },
      error: (error) => {
        console.error("Error creating specialty", error);
      }
    });
  }

  update() {
    this.trySend = true; // se activa el envío del formulario
    if (this.theFormGroup.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, complete todos los campos requeridos.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      })
      return
    }
    this.specialtyService.update(this.specialty).subscribe({
      next: (specialty) => {
        console.log("specialty updated successfully", specialty);
        Swal.fire({
          title: 'Actualizado',
          text: "Estado actualizado correctamente",
          icon: 'success',
        });
        this.router.navigate(['/specialties/list']);
      },
      error: (error) => {
        console.error("Error updating specialty", error);
      }
    });
  }

  view() {
    this.specialtyService.view(this.specialty.id).subscribe({
      next: (specialty) => {
        console.log("specialty viewed successfully", specialty);
      },
      error: (error) => {
        console.error("Error viewing specialty", error);
      }
    });
  }
}

