import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Quota } from 'src/app/models/quota.model';
import { QuotaService } from 'src/app/services/quota.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  quotas: Quota[] = [];
  constructor(private quotaService:QuotaService, private router:Router) //el router ayuda hacer saltos
  { }

  ngOnInit(): void {
    this.quotaService.list().subscribe({
      next: (quotas) => {
        this.quotas = quotas;
        console.log("quotas fetched successfully", this.quotas);
      },
      error: (error) => {
        console.error("Error fetching quotas", error);
      }
    });
  }

  edit(id: number) {
    this.router.navigate(['/quotas/update',id]); //Estos son los saltos que hace el router, en el frontend, cuando se da click en el boton editar salta a la ventana de actualizar
  }

  view(id: number) {
    this.router.navigate(['/quotas/view',id]);
  }

  create() {
    this.router.navigate(['/quotas/create']);
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
        this.quotaService.delete(id).
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
