import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MayorTown } from 'src/app/models/mayor-town.model';
import { MayorTownService } from 'src/app/services/mayor-town.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  mayorTowns: MayorTown[] = [];
  constructor(private mayorTownService:MayorTownService, private router:Router) //el router ayuda hacer saltos
  { }

  ngOnInit(): void {
    this.mayorTownService.list().subscribe({
      next: (mayorTowns) => {
        this.mayorTowns = mayorTowns;
        console.log("mayorTowns fetched successfully", this.mayorTowns);
      },
      error: (error) => {
        console.error("Error fetching mayorTowns", error);
      }
    });
  }

  edit(id: number) {
    this.router.navigate(['/mayor-town/update',id]); //Estos son los saltos que hace el router, en el frontend, cuando se da click en el boton editar salta a la ventana de actualizar
  }

  view(id: number) {
    this.router.navigate(['/mayor-town/view',id]);
  }

  create() {
    this.router.navigate(['/mayor-town/create']);
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
        this.mayorTownService.delete(id).
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
