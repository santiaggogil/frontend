import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MachinePolicy } from 'src/app/models/machine-policy.model'; // CAMBIO: Modelo importado
import Swal from 'sweetalert2';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MachinePolicyService } from 'src/app/services/machine-policy.service'; // CAMBIO: Servicio importado (asegúrate que exista y la ruta sea correcta)


@Component({
  selector: 'app-machine-policy-list', // CAMBIO: Selector
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [CurrencyPipe, DatePipe]
})
export class MachinePolicyListComponent implements OnInit { // CAMBIO: Nombre de la clase
  machine_policies: MachinePolicy[] = []; // CAMBIO: Nombre de variable y tipo

  constructor(
    private machinePolicyService: MachinePolicyService, // CAMBIO: Servicio inyectado
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMachinePolicies(); // CAMBIO: Llamada al método
  }

  loadMachinePolicies(): void { // CAMBIO: Nombre del método
    this.machinePolicyService.list().subscribe({ // CAMBIO: Llamada al servicio
      next: (policies) => {
        this.machine_policies = policies; // CAMBIO: Asignación a variable
        console.log("Machine policies fetched successfully", this.machine_policies); // CAMBIO: Log
      },
      error: (error) => {
        console.error("Error fetching machine policies", error); // CAMBIO: Log
        Swal.fire('Error', 'No se pudieron cargar las pólizas de máquinas.', 'error'); // CAMBIO: Mensaje de error
      }
    });
  }

  edit(id: number): void {
    this.router.navigate(['/machinePolicies/update', id]); // CAMBIO: Ruta
  }

  view(id: number): void {
    this.router.navigate(['/machinePolicies/view', id]); // CAMBIO: Ruta
  }

  create(): void {
    this.router.navigate(['/machinePolicies/create']); // CAMBIO: Ruta
  }

  delete(id: number): void {
    console.log("Attempting to delete machine policy with id:", id); // CAMBIO: Log
    Swal.fire({
      title: 'Eliminar Póliza', // Puede ser genérico o "Eliminar Póliza de Máquina"
      text: "¿Estás seguro de que deseas eliminar esta póliza de máquina?", // CAMBIO: Texto de confirmación
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarla',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.machinePolicyService.delete(id).subscribe({ // CAMBIO: Llamada al servicio
          next: () => {
            Swal.fire(
              'Eliminada',
              'La póliza ha sido eliminada correctamente.',
              'success'
            );
            this.loadMachinePolicies(); // CAMBIO: Recargar la lista
          },
          error: (error) => {
            console.error("Error deleting machine policy", error); // CAMBIO: Log
            Swal.fire('Error', 'No se pudo eliminar la póliza.', 'error');
          }
        });
      }
    });
  }
}
