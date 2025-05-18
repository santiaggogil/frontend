import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { New } from 'src/app/models/new.model'; // Asegúrate que la ruta sea correcta
import { NewService } from 'src/app/services/new.service'; // Asegúrate que este servicio exista y la ruta sea correcta
import Swal from 'sweetalert2';

@Component({
  selector: 'app-news-list', // Selector actualizado
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class NewsListComponent implements OnInit { // Nombre de clase actualizado
  newsList: New[] = []; // Nombre de la propiedad y tipo actualizados

  constructor(
    private newService: NewService, // Servicio inyectado actualizado
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.newService.list().subscribe({
      next: (data: New[]) => {
        this.newsList = data;
        console.log("News fetched successfully", this.newsList);
      },
      error: (error) => {
        console.error("Error fetching news", error);
        Swal.fire(
          'Error',
          'No se pudieron cargar las novedades. Intente más tarde.',
          'error'
        );
      }
    });
  }

  edit(id: number): void {
    this.router.navigate(['/news/update', id]); // Ruta actualizada
  }

  view(id: number): void {
    this.router.navigate(['/news/view', id]); // Ruta actualizada
  }

  create(): void {
    this.router.navigate(['/news/create']); // Ruta actualizada
  }

  delete(id: number): void {
    console.log("Delete news item with id:", id);
    Swal.fire({
      title: 'Eliminar Novedad',
      text: "¿Estás seguro de que deseas eliminar esta novedad?", // Mensaje actualizado
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarla',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.newService.delete(id).subscribe({
          next: () => {
            Swal.fire(
              'Eliminada',
              'La novedad ha sido eliminada correctamente.', // Mensaje actualizado
              'success'
            );
            this.loadNews(); // Recargar la lista
          },
          error: (error) => {
            console.error("Error deleting news item", error);
            Swal.fire(
              'Error',
              'No se pudo eliminar la novedad. Verifique si tiene dependencias.',
              'error'
            );
          }
        });
      }
    });
  }
}
