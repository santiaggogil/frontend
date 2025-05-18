import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Town } from 'src/app/models/town.model';
import { TownService } from 'src/app/services/town.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  towns: Town[] = [];
  constructor(private townService:TownService, private router:Router) //el router ayuda hacer saltos
  { }

  ngOnInit(): void {
    this.townService.list().subscribe({
      next: (towns) => {
        this.towns = towns;
        console.log("towns fetched successfully", this.towns);
      },
      error: (error) => {
        console.error("Error fetching towns", error);
      }
    });
  }

  edit(id: number) {
    this.router.navigate(['/towns/update',id]); //Estos son los saltos que hace el router, en el frontend, cuando se da click en el boton editar salta a la ventana de actualizar
  }

  view(id: number) {
    this.router.navigate(['/towns/view',id]);
  }

  create() {
    this.router.navigate(['/towns/create']);
  }

  delete(id: number) {
    console.log("Delete specialtie with id:", id);
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
        this.townService.delete(id).
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
