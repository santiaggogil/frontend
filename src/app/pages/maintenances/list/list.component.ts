import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Maintenance } from 'src/app/models/maintenance.model'; // Asegúrate que la ruta sea correcta
import Swal from 'sweetalert2';
import { CurrencyPipe, DatePipe } from '@angular/common'; // Importa CurrencyPipe y DatePipe
import { MaintenanceService } from 'src/app/services/maintenance.service'; // ajusta la ruta y el nombre del servicio

@Component({
  selector: 'app-news-list', // Selector actualizado
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class MaintenanceListComponent implements OnInit {
  maintenances: Maintenance[] = [];

  constructor(
    private maintenanceService: MaintenanceService, // Servicio para Maintenance
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMaintenances();
  }

  loadMaintenances(): void {
    this.maintenanceService.list().subscribe({
      next: (data) => {
        this.maintenances = data;
        console.log("Maintenances fetched successfully", this.maintenances);
      },
      error: (error) => {
        console.error("Error fetching maintenances", error);
        Swal.fire('Error', 'No se pudieron cargar los mantenimientos.', 'error');
      }
    });
  }

  edit(id: number): void {
    this.router.navigate(['/maintenances/update', id]); // Ajusta la ruta base
  }

  view(id: number): void {
    this.router.navigate(['/maintenances/view', id]); // Ajusta la ruta base
  }

  create(): void {
    this.router.navigate(['/maintenances/create']); // Ajusta la ruta base
  }

  delete(id: number): void {
    console.log("Attempting to delete maintenance with id:", id);
    Swal.fire({
      title: 'Eliminar Mantenimiento',
      text: "¿Estás seguro de que deseas eliminar este mantenimiento?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.maintenanceService.delete(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado',
              'El mantenimiento ha sido eliminado correctamente.',
              'success'
            );
            this.loadMaintenances(); // Recarga la lista
          },
          error: (error) => {
            console.error("Error deleting maintenance", error);
            Swal.fire('Error', 'No se pudo eliminar el mantenimiento.', 'error');
          }
        });
      }
    });
  }
}
