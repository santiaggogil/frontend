import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { State } from 'src/app/models/state.model';
import { StateService } from 'src/app/services/state.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  states: State[] = [];
  constructor(private stateService:StateService, private router:Router) //el router ayuda hacer saltos
  { }

  ngOnInit(): void {
    this.stateService.list().subscribe({
      next: (states) => {
        this.states = states;
        console.log("States fetched successfully", this.states);
      },
      error: (error) => {
        console.error("Error fetching states", error);
      }
    });
  }

  edit(id: number) {
    this.router.navigate(['/states/update',id]); //Estos son los saltos que hace el router, en el frontend, cuando se da click en el boton editar salta a la ventana de actualizar
  }

  view(id: number) {
    this.router.navigate(['/states/view',id]);
  }

  create() {
    this.router.navigate(['/states/create']);
  }

  delete(id: number) {
    console.log("Delete state with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "¿Estás seguro de que deseas eliminar este estado?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.stateService.delete(id).
        subscribe(data => {
          Swal.fire(
            'Eliminado',
            'Registro eliminado correctamente',
            'success'
          );
          this.ngOnInit();
        });
      }
    });
  }
}
