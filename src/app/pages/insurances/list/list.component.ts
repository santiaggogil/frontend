import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Insurance } from 'src/app/models/insurance.model';
import { InsuranceService } from 'src/app/services/insurance.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  insurances: Insurance[] = [];
  constructor(private insuranceService: InsuranceService, private router: Router) //el router ayuda hacer saltos
  { }

  ngOnInit(): void {
    this.insuranceService.list().subscribe({
      next: (insurances) => {
        this.insurances = insurances;
        console.log("insurances fetched successfully", this.insurances);
      },
      error: (error) => {
        console.error("Error fetching insurances", error);
      }
    });
  }

  edit(id: number) {
    this.router.navigate(['/insurances/update',id]); //Estos son los saltos que hace el router, en el frontend, cuando se da click en el boton editar salta a la ventana de actualizar
  }

  view(id: number) {
    this.router.navigate(['/insurances/view',id]);
  }

  create() {
    this.router.navigate(['/insurances/create']);
  }

  delete(id: number) {
    console.log("Delete insurance with id:", id);
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
        this.insuranceService.delete(id).
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
