import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceType } from 'src/app/models/service-type.model';
import { ServiceTypeService } from 'src/app/services/service-type.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-service-type-list', // CAMBIO: Selector
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [CurrencyPipe, DatePipe]
})
export class ServiceTypeListComponent implements OnInit {
  serviceTypes: ServiceType[] = [];

  constructor(
    private serviceTypeService: ServiceTypeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadServiceTypes();
  }

  loadServiceTypes(): void {
    this.serviceTypeService.list().subscribe({
      next: (data) => {
        this.serviceTypes = data;
        // console.log("Service types fetched successfully", this.serviceTypes);
      },
      error: (error) => {
        console.error("Error fetching service types", error);
        Swal.fire('Error', 'No se pudieron cargar los tipos de servicio.', 'error');
      }
    });
  }

  edit(id: number): void {
    this.router.navigate(['/serviceTypes/update', id]); // AJUSTA ESTA RUTA
  }

  view(id: number): void {
    this.router.navigate(['/serviceTypes/view', id]); // AJUSTA ESTA RUTA
  }

  create(): void {
    this.router.navigate(['/serviceTypes/create']); // AJUSTA ESTA RUTA
  }

  delete(id: number): void {
    // console.log("Attempting to delete service type with id:", id);
    Swal.fire({
      title: 'Eliminar Tipo de Servicio',
      text: "¿Estás seguro de que deseas eliminar este tipo de servicio?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceTypeService.delete(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado',
              'El tipo de servicio ha sido eliminado correctamente.',
              'success'
            );
            this.loadServiceTypes(); // Recargar la lista
          },
          error: (error) => {
            console.error("Error deleting service type", error);
            const errorMessage = error.error?.message || 'No se pudo eliminar el tipo de servicio.';
            Swal.fire('Error', errorMessage, 'error');
          }
        });
      }
    });
  }
}
