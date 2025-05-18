import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Procedure } from 'src/app/models/procedure.model'; // Asegúrate que la ruta sea correcta
import Swal from 'sweetalert2';
// No se necesitan CurrencyPipe ni DatePipe para Procedure
import { ProcedureService } from 'src/app/services/procedure.service'; // Ajusta la ruta y el nombre del servicio

@Component({
  selector: 'app-procedure-list', // Selector actualizado para procedimientos
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ProcedureListComponent implements OnInit {
  procedures: Procedure[] = [];

  constructor(
    private procedureService: ProcedureService, // Servicio para Procedure
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProcedures();
  }

  loadProcedures(): void {
    this.procedureService.list().subscribe({
      next: (data) => {
        this.procedures = data;
        console.log("Procedures fetched successfully", this.procedures);
      },
      error: (error) => {
        console.error("Error fetching procedures", error);
        Swal.fire('Error', 'No se pudieron cargar los procedimientos.', 'error');
      }
    });
  }

  edit(id: number): void {
    this.router.navigate(['/procedures/update', id]); // Ajusta la ruta base
  }

  view(id: number): void {
    this.router.navigate(['/procedures/view', id]); // Ajusta la ruta base
  }

  create(): void {
    this.router.navigate(['/procedures/create']); // Ajusta la ruta base
  }

  delete(id: number): void {
    console.log("Attempting to delete procedure with id:", id);
    Swal.fire({
      title: 'Eliminar Procedimiento',
      text: "¿Estás seguro de que deseas eliminar este procedimiento?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.procedureService.delete(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado',
              'El procedimiento ha sido eliminado correctamente.',
              'success'
            );
            this.loadProcedures(); // Recarga la lista
          },
          error: (error) => {
            console.error("Error deleting procedure", error);
            Swal.fire('Error', 'No se pudo eliminar el procedimiento.', 'error');
          }
        });
      }
    });
  }
}
