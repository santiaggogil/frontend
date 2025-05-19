import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MaintenanceProcedure } from 'src/app/models/maintenance-procedure.model'; // Asegúrate que la ruta sea correcta
import Swal from 'sweetalert2';
// Ya no se necesitan CurrencyPipe ni DatePipe para este modelo específico
import { MaintenanceProcedureService } from 'src/app/services/maintenance-procedure.service'; // Ajusta la ruta y el nombre del servicio

@Component({
  selector: 'app-maintenance-procedure-list', // Selector actualizado para la nueva entidad
  templateUrl: './list.component.html', // Asegúrate que apunte al HTML correcto
  styleUrls: ['./list.component.scss']
})
export class MaintenanceProcedureListComponent implements OnInit {
  maintenanceProcedures: MaintenanceProcedure[] = [];

  constructor(
    private maintenanceProcedureService: MaintenanceProcedureService, // Servicio para MaintenanceProcedure
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMaintenanceProcedures();
  }

  loadMaintenanceProcedures(): void {
    this.maintenanceProcedureService.list().subscribe({
      next: (data) => {
        this.maintenanceProcedures = data;
        console.log("MaintenanceProcedures fetched successfully", this.maintenanceProcedures);
      },
      error: (error) => {
        console.error("Error fetching maintenance procedures", error);
        Swal.fire('Error', 'No se pudieron cargar los procedimientos de mantenimiento.', 'error');
      }
    });
  }

  edit(id: number): void {
    this.router.navigate(['/maintenanceProcedures/update', id]); // Ajusta la ruta base
  }

  view(id: number): void {
    this.router.navigate(['/maintenanceProcedures/view', id]); // Ajusta la ruta base
  }

  create(): void {
    this.router.navigate(['/maintenanceProcedures/create']); // Ajusta la ruta base
  }

  delete(id: number): void {
    console.log("Attempting to delete maintenance procedure with id:", id);
    Swal.fire({
      title: 'Eliminar Procedimiento de Mantenimiento',
      text: "¿Estás seguro de que deseas eliminar este procedimiento de mantenimiento?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.maintenanceProcedureService.delete(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado',
              'El procedimiento de mantenimiento ha sido eliminado correctamente.',
              'success'
            );
            this.loadMaintenanceProcedures(); // Recarga la lista
          },
          error: (error) => {
            console.error("Error deleting maintenance procedure", error);
            Swal.fire('Error', 'No se pudo eliminar el procedimiento de mantenimiento.', 'error');
          }
        });
      }
    });
  }
}
