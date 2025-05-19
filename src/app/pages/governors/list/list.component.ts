import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Governor } from 'src/app/models/governor.model';
import { GovernorService } from 'src/app/services/governor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  governors: Governor[] = [];
  constructor(private governorService:GovernorService, private router:Router) //el router ayuda hacer saltos
  { }

  ngOnInit(): void {
    this.governorService.list().subscribe({
      next: (governors) => {
        this.governors = governors;
        console.log("governors fetched successfully", this.governors);
      },
      error: (error) => {
        console.error("Error fetching governors", error);
      }
    });
  }

  edit(id: number) {
    this.router.navigate(['/governors/update',id]); //Estos son los saltos que hace el router, en el frontend, cuando se da click en el boton editar salta a la ventana de actualizar
  }

  view(id: number) {
    this.router.navigate(['/governors/view',id]);
  }

  create() {
    this.router.navigate(['/governors/create']);
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
        this.governorService.delete(id).
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
