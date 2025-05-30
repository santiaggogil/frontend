import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { State } from 'src/app/models/state.model';
import { StateService } from 'src/app/services/state.service'; // AÑADE ESTA LÍNEA
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
  state: State;
  theFormGroup: FormGroup; //policia del formulario
  trySend: boolean; // variable para controlar el envío del formulario

  constructor(private activateRoute:ActivatedRoute, private stateService: StateService, private router:Router, private theFormBuilder: FormBuilder) { // inyeccion de activatedRoute para obtener la url activa en el navegador, esto toma 'fotos'// inyeccion de activatedRoute para obtener la url activa en el navegador, esto toma 'fotos'
    this.state={id:0}; // inicializa el objeto state
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
      this.state.id = this.activateRoute.snapshot.params.id
      this.getState(this.state.id)
    }
  }

  getState(id: number) {
    this.stateService.view(id).subscribe({
      next: (state) => {
        this.state = state;
        console.log("State fetched successfully", this.state);
      },
      error: (error) => {
        console.error("Error fetching state", error);
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
          Validators.pattern('^[a-zA-Z\\s]+$') // solo letras y espacios
        ]
      ],
      region: [
        '',
        [
          Validators.required,              // campo obligatorio
          Validators.minLength(2),          // mínimo 2 caracteres
          Validators.maxLength(50),         // máximo 50 caracteres
          Validators.pattern('^[a-zA-Z\\s]+$') // solo letras y espacios
        ]
      ]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls
  }

  back() {
    this.router.navigate(['/states/list']);
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

    this.stateService.create(this.state).subscribe({
      next: (state) => {
        console.log("State created successfully", state);
        Swal.fire({
          title: 'Creado',
          text: "Estado creado correctamente",
          icon: 'success',
        });
        this.router.navigate(['/states/list']);
      },
      error: (error) => {
        console.error("Error creating state", error);
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
    this.stateService.update(this.state).subscribe({
      next: (state) => {
        console.log("State updated successfully", state);
        Swal.fire({
          title: 'Actualizado',
          text: "Estado actualizado correctamente",
          icon: 'success',
        });
        this.router.navigate(['/states/list']);
      },
      error: (error) => {
        console.error("Error updating state", error);
      }
    });
  }

  view() {
    this.stateService.view(this.state.id).subscribe({
      next: (state) => {
        console.log("State viewed successfully", state);
      },
      error: (error) => {
        console.error("Error viewing state", error);
      }
    });
  }
}

