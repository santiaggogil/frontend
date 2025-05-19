import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Package } from 'src/app/models/package.model';
import { PackageService } from 'src/app/services/package.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  packages: Package[] = [];
  constructor(private packageService:PackageService, private router:Router) //el router ayuda hacer saltos
  { }

  ngOnInit(): void {
    this.packageService.list().subscribe({
      next: (packages) => {
        this.packages = packages;
        console.log("packages fetched successfully", this.packages);
      },
      error: (error) => {
        console.error("Error fetching packages", error);
      }
    });
  }

  edit(id: number) {
    this.router.navigate(['/packages/update',id]); //Estos son los saltos que hace el router, en el frontend, cuando se da click en el boton editar salta a la ventana de actualizar
  }

  view(id: number) {
    this.router.navigate(['/packages/view',id]);
  }

  create() {
    this.router.navigate(['/packages/create']);
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
        this.packageService.delete(id).
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
