import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Review } from 'src/app/models/review.model';
import { ReviewService } from 'src/app/services/review.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  reviews: Review[] = [];
  constructor(private reviewService:ReviewService, private router:Router) //el router ayuda hacer saltos
  { }

  ngOnInit(): void {
    this.reviewService.list().subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        console.log("reviews fetched successfully", this.reviews);
      },
      error: (error) => {
        console.error("Error fetching reviews", error);
      }
    });
  }

  edit(id: number) {
    this.router.navigate(['/reviews/update',id]); //Estos son los saltos que hace el router, en el frontend, cuando se da click en el boton editar salta a la ventana de actualizar
  }

  view(id: number) {
    this.router.navigate(['/reviews/view',id]);
  }

  create() {
    this.router.navigate(['/reviews/create']);
  }

  delete(id: number) {
    console.log("Delete specialtie with id:", id);
    Swal.fire({
      title: 'Eliminar',
      text: "¿Estás seguro de que deseas eliminar este estado?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.reviewService.delete(id).
        subscribe(data => {
          Swal.fire(
            'Eliminado',
            'Registro eliminado correctamente',
            'success'
          );
          this.ngOnInit();
        });
      }
    });
  }
}
