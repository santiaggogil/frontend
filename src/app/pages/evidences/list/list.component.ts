import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Evidence } from 'src/app/models/evidence.model';
import { EvidenceService } from 'src/app/services/evidence.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  evidences: Evidence[] = [];
  constructor(private evidenceService:EvidenceService, private router:Router) //el router ayuda hacer saltos
  { }

  ngOnInit(): void {
    this.evidenceService.list().subscribe({
      next: (evidences) => {
        this.evidences = evidences;
        console.log("evidences fetched successfully", this.evidences);
      },
      error: (error) => {
        console.error("Error fetching evidences", error);
      }
    });
  }

  edit(id: number) {
    this.router.navigate(['/evidences/update',id]); //Estos son los saltos que hace el router, en el frontend, cuando se da click en el boton editar salta a la ventana de actualizar
  }

  view(id: number) {
    this.router.navigate(['/evidences/view',id]);
  }

  create() {
    this.router.navigate(['/evidences/create']);
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
        this.evidenceService.delete(id).
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
