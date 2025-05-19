import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Mayor } from 'src/app/models/mayor.model';
import { MayorService } from 'src/app/services/mayor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  mayors: Mayor[] = [];
  constructor(private mayorService:MayorService, private router:Router) //el router ayuda hacer saltos
  { }

  ngOnInit(): void {
    this.mayorService.list().subscribe({
      next: (mayors) => {
        this.mayors = mayors;
        console.log("mayors fetched successfully", this.mayors);
      },
      error: (error) => {
        console.error("Error fetching mayors", error);
      }
    });
  }

  edit(id: number) {
    this.router.navigate(['/mayors/update',id]); //Estos son los saltos que hace el router, en el frontend, cuando se da click en el boton editar salta a la ventana de actualizar
  }

  view(id: number) {
    this.router.navigate(['/mayors/view',id]);
  }

  create() {
    this.router.navigate(['/mayors/create']);
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
        this.mayorService.delete(id).
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
