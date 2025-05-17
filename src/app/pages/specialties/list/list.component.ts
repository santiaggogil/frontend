import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Specialty } from 'src/app/models/specialty.model';
import { SpecialtyService } from 'src/app/services/specialty.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  specialties: Specialty[] = [];
  constructor(private specialtyService:SpecialtyService, private router:Router) //el router ayuda hacer saltos
  { }

  ngOnInit(): void {
    this.specialtyService.list().subscribe({
      next: (specialties) => {
        this.specialties = specialties;
        console.log("specialties fetched successfully", this.specialties);
      },
      error: (error) => {
        console.error("Error fetching specialties", error);
      }
    });
  }

  edit(id: number) {
    this.router.navigate(['/specialties/update',id]); //Estos son los saltos que hace el router, en el frontend, cuando se da click en el boton editar salta a la ventana de actualizar
  }

  view(id: number) {
    this.router.navigate(['/specialties/view',id]);
  }

  create() {
    this.router.navigate(['/specialties/create']);
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
        this.specialtyService.delete(id).
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
