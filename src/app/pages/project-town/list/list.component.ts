import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectTown } from 'src/app/models/project-town.model';
import { ProjectTownService } from 'src/app/services/project-town.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  projectTowns: ProjectTown[] = [];
  constructor(private projectTownService:ProjectTownService, private router:Router) //el router ayuda hacer saltos
  { }

  ngOnInit(): void {
    this.projectTownService.list().subscribe({
      next: (projectTowns) => {
        this.projectTowns = projectTowns;
        console.log("projectTowns fetched successfully", this.projectTowns);
      },
      error: (error) => {
        console.error("Error fetching projectTowns", error);
      }
    });
  }

  edit(id: number) {
    this.router.navigate(['/project-town/update',id]); //Estos son los saltos que hace el router, en el frontend, cuando se da click en el boton editar salta a la ventana de actualizar
  }

  view(id: number) {
    this.router.navigate(['/project-town/view',id]);
  }

  create() {
    this.router.navigate(['/project-town/create']);
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
        this.projectTownService.delete(id).
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
