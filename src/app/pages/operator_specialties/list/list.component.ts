import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OperatorSpecialties } from 'src/app/models/operator-specialties.model';
import { Operator_specialtyService } from 'src/app/services/operator-specialties.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  operator_specialties: OperatorSpecialties[] = [];
  constructor(private operatorSpecialtyService: Operator_specialtyService, private router: Router) //el router ayuda hacer saltos
  { }

  ngOnInit(): void {
    this.operatorSpecialtyService.list().subscribe({
      next: (operator_specialties) => {
        this.operator_specialties = operator_specialties;
        console.log("operator_specialties fetched successfully", this.operator_specialties);
      },
      error: (error) => {
        console.error("Error fetching operator_specialties", error);
      }
    });
  }

  edit(id: number) {
    this.router.navigate(['/operatorSpecialties/update',id]); //Estos son los saltos que hace el router, en el frontend, cuando se da click en el boton editar salta a la ventana de actualizar
  }

  view(id: number) {
    this.router.navigate(['/operatorSpecialties/view',id]);
  }

  create() {
    this.router.navigate(['/operatorSpecialties/create']);
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
        this.operatorSpecialtyService.delete(id).
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
