import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Bill } from 'src/app/models/bill.model';
import { BillService } from 'src/app/services/bill.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  bills: Bill[] = [];
  constructor(private billService:BillService, private router:Router) //el router ayuda hacer saltos
  { }

  ngOnInit(): void {
    this.billService.list().subscribe({
      next: (bills) => {
        this.bills = bills;
        console.log("bills fetched successfully", this.bills);
      },
      error: (error) => {
        console.error("Error fetching bills", error);
      }
    });
  }

  edit(id: number) {
    this.router.navigate(['/bills/update',id]); //Estos son los saltos que hace el router, en el frontend, cuando se da click en el boton editar salta a la ventana de actualizar
  }

  view(id: number) {
    this.router.navigate(['/bills/view',id]);
  }

  create() {
    this.router.navigate(['/bills/create']);
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
        this.billService.delete(id).
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
