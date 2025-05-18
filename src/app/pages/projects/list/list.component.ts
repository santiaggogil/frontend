import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project.model';
import { ProjectService } from 'src/app/services/project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  projects: Project[] = [];
  constructor(private projectService:ProjectService, private router:Router) //el router ayuda hacer saltos
  { }

  ngOnInit(): void {
    this.projectService.list().subscribe({
      next: (projects) => {
        this.projects = projects;
        console.log("projects fetched successfully", this.projects);
      },
      error: (error) => {
        console.error("Error fetching projects", error);
      }
    });
  }

  edit(id: number) {
    this.router.navigate(['/projects/update',id]); //Estos son los saltos que hace el router, en el frontend, cuando se da click en el boton editar salta a la ventana de actualizar
  }

  view(id: number) {
    this.router.navigate(['/projects/view',id]);
  }

  create() {
    this.router.navigate(['/projects/create']);
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
        this.projectService.delete(id).
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
