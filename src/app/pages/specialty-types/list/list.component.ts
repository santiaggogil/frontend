import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpecialtyType } from 'src/app/models/specialty-type.model';
import { SpecialtyTypeService } from 'src/app/services/specialty-type.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-specialty-type-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [CurrencyPipe, DatePipe]
})
export class SpecialtyTypeListComponent implements OnInit {
  specialtyTypes: SpecialtyType[] = [];

  constructor(
    private specialtyTypeService: SpecialtyTypeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSpecialtyTypes();
  }

  loadSpecialtyTypes(): void {
    this.specialtyTypeService.list().subscribe({
      next: (data) => {
        this.specialtyTypes = data;
      },
      error: (error) => {
        console.error("Error fetching specialty types", error);
        Swal.fire('Error', 'No se pudieron cargar las especialidades.', 'error');
      }
    });
  }

  edit(id: number): void {
    this.router.navigate(['/specialtyTypes/update', id]);
  }

  view(id: number): void {
    this.router.navigate(['/specialtyTypes/view', id]);
  }

  create(): void {
    this.router.navigate(['/specialtyTypes/create']);
  }

  delete(id: number): void {
    Swal.fire({
      title: 'Eliminar Especialidad',
      text: "¿Estás seguro de que deseas eliminar esta especialidad?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarla',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.specialtyTypeService.delete(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminada',
              'La especialidad ha sido eliminada correctamente.',
              'success'
            );
            this.loadSpecialtyTypes();
          },
          error: (error) => {
            console.error("Error deleting specialty type", error);
            const errorMessage = error.error?.message || 'No se pudo eliminar la especialidad.';
            Swal.fire('Error', errorMessage, 'error');
          }
        });
      }
    });
  }
}
