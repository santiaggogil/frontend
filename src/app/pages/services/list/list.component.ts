import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from 'src/app/models/service.model';
import { ServiceService } from 'src/app/services/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  services: Service[] = [];
  constructor(private serviceService:ServiceService, private router:Router) //el router ayuda hacer saltos
  { }

  ngOnInit(): void {
    this.serviceService.list().subscribe({
      next: (services) => {
        this.services = services;
        console.log("Services fetched successfully", this.services);
      },
      error: (error) => {
        console.error("Error fetching services", error);
      }
    });
  }

  edit(id: number) {
    this.router.navigate(['/services/update',id]); //Estos son los saltos que hace el router, en el frontend, cuando se da click en el boton editar salta a la ventana de actualizar
  }

  view(id: number) {
    this.router.navigate(['/services/view',id]);
  }

  create() {
    this.router.navigate(['/services/create']);
  }

  delete(id: number) {
    console.log("Delete service with id:", id);
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
        this.serviceService.delete(id).
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
