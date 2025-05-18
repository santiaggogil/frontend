// src/app/components/machines/list/list.component.ts (ejemplo de ruta)
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Machine } from 'src/app/models/machine.model'; // Importar el modelo Machine
import { MachineService } from 'src/app/services/machine.service'; // Importar el servicio MachineService
import Swal from 'sweetalert2';

@Component({
  selector: 'app-machine-list', // Selector actualizado
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class MachineListComponent implements OnInit { // Nombre de clase actualizado
  machines: Machine[] = []; // Variable para almacenar las máquinas

  constructor(
    private machineService: MachineService, // Inyectar MachineService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMachines(); // Llamar al método para cargar máquinas
  }

  loadMachines(): void { // Método para cargar las máquinas
    this.machineService.list().subscribe({
      next: (data) => {
        this.machines = data;
        console.log("Machines fetched successfully", this.machines);
      },
      error: (error) => {
        console.error("Error fetching machines", error);
        Swal.fire('Error', 'No se pudieron cargar las máquinas.', 'error');
      }
    });
  }

  edit(id: number): void {
    this.router.navigate(['/machines/update', id]); // Ruta para editar máquinas
  }

  view(id: number): void {
    this.router.navigate(['/machines/view', id]); // Ruta para ver máquinas
  }

  create(): void {
    this.router.navigate(['/machines/create']); // Ruta para crear máquinas
  }

  delete(id: number): void {
    console.log("Delete machine with id:", id);
    Swal.fire({
      title: 'Eliminar Máquina', // Título del Swal adaptado
      text: "¿Estás seguro de que deseas eliminar esta máquina?", // Texto del Swal adaptado
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarla',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.machineService.delete(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminada',
              'La máquina ha sido eliminada correctamente.', // Mensaje de éxito adaptado
              'success'
            );
            this.loadMachines(); // Recargar la lista después de eliminar
          },
          error: (error) => {
            console.error("Error deleting machine", error);
            Swal.fire('Error', 'No se pudo eliminar la máquina.', 'error');
          }
        });
      }
    });
  }
}
