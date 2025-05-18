import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Shift } from 'src/app/models/shift.model'; // CAMBIO: Modelo importado
import Swal from 'sweetalert2';
// import { DatePipe } from '@angular/common'; // Opcional, si necesitas formatear fechas/horas
import { ShiftService } from 'src/app/services/shift.service'; // CAMBIO: Servicio importado (asegúrate que exista y la ruta sea correcta)


@Component({
  selector: 'app-shift-list', // CAMBIO: Selector
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  // providers: [DatePipe] // Opcional
})
export class ShiftListComponent implements OnInit { // CAMBIO: Nombre de la clase
  shifts: Shift[] = []; // CAMBIO: Nombre de variable y tipo

  constructor(
    private shiftService: ShiftService, // CAMBIO: Servicio inyectado
    private router: Router
    // private datePipe: DatePipe // Opcional
  ) {}

  ngOnInit(): void {
    this.loadShifts(); // CAMBIO: Llamada al método
  }

  loadShifts(): void { // CAMBIO: Nombre del método
    this.shiftService.list().subscribe({ // CAMBIO: Llamada al servicio
      next: (data) => { // 'data' es un nombre común para la respuesta
        this.shifts = data; // CAMBIO: Asignación a variable
        console.log("Shifts fetched successfully", this.shifts); // CAMBIO: Log
      },
      error: (error) => {
        console.error("Error fetching shifts", error); // CAMBIO: Log
        Swal.fire('Error', 'No se pudieron cargar los turnos.', 'error'); // CAMBIO: Mensaje de error
      }
    });
  }

  edit(id: number): void {
    this.router.navigate(['/shifts/update', id]); // CAMBIO: Ruta
  }

  view(id: number): void {
    this.router.navigate(['/shifts/view', id]); // CAMBIO: Ruta
  }

  create(): void {
    this.router.navigate(['/shifts/create']); // CAMBIO: Ruta
  }

  delete(id: number): void {
    console.log("Attempting to delete shift with id:", id); // CAMBIO: Log
    Swal.fire({
      title: 'Eliminar Turno', // CAMBIO: Texto
      text: "¿Estás seguro de que deseas eliminar este turno?", // CAMBIO: Texto de confirmación
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.shiftService.delete(id).subscribe({ // CAMBIO: Llamada al servicio
          next: () => {
            Swal.fire(
              'Eliminado',
              'El turno ha sido eliminado correctamente.', // CAMBIO: Texto
              'success'
            );
            this.loadShifts(); // CAMBIO: Recargar la lista
          },
          error: (error) => {
            console.error("Error deleting shift", error); // CAMBIO: Log
            Swal.fire('Error', 'No se pudo eliminar el turno.', 'error'); // CAMBIO: Texto
          }
        });
      }
    });
  }
}
