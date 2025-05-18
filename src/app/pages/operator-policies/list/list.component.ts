import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OperatorPolicy } from 'src/app/models/operator-policy.model'; // Asegúrate que la ruta sea correcta
import Swal from 'sweetalert2';
import { CurrencyPipe, DatePipe } from '@angular/common'; // Importa CurrencyPipe y DatePipe
import { OperatorPolicyervice } from 'src/app/services/operator-policy.service'; // ajusta la ruta si es diferente


@Component({
  selector: 'app-operator-policy-list', // Cambia el selector si es necesario
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [CurrencyPipe, DatePipe] // Añade los pipes a providers si los usas directamente en el TS (aunque aquí se usan en template)
})
export class OperatorPolicyListComponent implements OnInit {
  operator_policies: OperatorPolicy[] = [];

  constructor(
    private operatorPolicyService: OperatorPolicyervice, // Asegúrate de que la ruta sea correcta
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOperatorPolicies();
  }

  loadOperatorPolicies(): void {
    this.operatorPolicyService.list().subscribe({
      next: (policies) => {
        this.operator_policies = policies;
        console.log("Operator policies fetched successfully", this.operator_policies);
      },
      error: (error) => {
        console.error("Error fetching operator policies", error);
        Swal.fire('Error', 'No se pudieron cargar las pólizas de operarios.', 'error');
      }
    });
  }

  edit(id: number): void {
    this.router.navigate(['/operatorPolicies/update', id]); // Ajusta la ruta según tu configuración
  }

  view(id: number): void {
    this.router.navigate(['/operatorPolicies/view', id]); // Ajusta la ruta según tu configuración
  }

  create(): void {
    this.router.navigate(['/operatorPolicies/create']); // Ajusta la ruta según tu configuración
  }

  delete(id: number): void {
    console.log("Attempting to delete operator policy with id:", id);
    Swal.fire({
      title: 'Eliminar Póliza',
      text: "¿Estás seguro de que deseas eliminar esta póliza de operario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarla',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.operatorPolicyService.delete(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminada',
              'La póliza ha sido eliminada correctamente.',
              'success'
            );
            this.loadOperatorPolicies(); // Recarga la lista
          },
          error: (error) => {
            console.error("Error deleting operator policy", error);
            Swal.fire('Error', 'No se pudo eliminar la póliza.', 'error');
          }
        });
      }
    });
  }
}
