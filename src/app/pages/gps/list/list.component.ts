// src/app/components/gps/list/list.component.ts (ejemplo de ruta)
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Gps } from 'src/app/models/gps.model'; // Importar el modelo Gps
import { GpsService } from 'src/app/services/gps.service'; // Importar el servicio GpsService
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gps-list', // Selector actualizado
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'] // Asumiendo que tienes un SCSS similar
})
export class GpsListComponent implements OnInit { // Nombre de clase actualizado
  gpses: Gps[] = []; // Variable para almacenar los dispositivos GPS, plural 'gpses'

  constructor(
    private gpsService: GpsService, // Inyectar GpsService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadGpses(); // Llamar al método para cargar GPS
  }

  loadGpses(): void { // Método para cargar los GPS
    this.gpsService.list().subscribe({
      next: (data) => {
        this.gpses = data;
        console.log("GPS devices fetched successfully", this.gpses);
      },
      error: (error) => {
        console.error("Error fetching GPS devices", error);
        Swal.fire('Error', 'No se pudieron cargar los dispositivos GPS.', 'error');
      }
    });
  }

  edit(id: number): void {
    this.router.navigate(['/gps/update', id]); // Ruta para editar GPS
  }

  view(id: number): void {
    this.router.navigate(['/gps/view', id]); // Ruta para ver GPS
  }

  create(): void {
    this.router.navigate(['/gps/create']); // Ruta para crear GPS
  }

  delete(id: number): void {
    console.log("Delete GPS with id:", id);
    Swal.fire({
      title: 'Eliminar GPS', // Título del Swal adaptado
      text: "¿Estás seguro de que deseas eliminar este dispositivo GPS?", // Texto del Swal adaptado
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.gpsService.delete(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminado',
              'El dispositivo GPS ha sido eliminado correctamente.', // Mensaje de éxito adaptado
              'success'
            );
            this.loadGpses(); // Recargar la lista después de eliminar
          },
          error: (error) => {
            console.error("Error deleting GPS device", error);
            Swal.fire('Error', 'No se pudo eliminar el dispositivo GPS.', 'error');
          }
        });
      }
    });
  }
}
