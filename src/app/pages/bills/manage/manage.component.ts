// src/app/pages/bills/manage/manage.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DateTime } from 'luxon'; // Para manejar fechas y formateo

import { Bill } from '../../../models/bill.model'; // Ajusta la ruta
import { BillService } from '../../../services/bill.service'; // Ajusta la ruta

@Component({
  selector: 'app-bill-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; // 1 - view, 2 - create, 3 - update
  theBill!: Bill;
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  // Opciones para el estado de la factura, puedes obtenerlas de un servicio o definirlas aquí
  statusOptions: string[] = ['pending', 'paid', 'overdue', 'cancelled'];


  constructor(
    private activateRoute: ActivatedRoute,
    private billService: BillService,
    private router: Router,
    private readonly theFormBuilder: FormBuilder
  ) {
    this.mode = 1; // Default
  }

  ngOnInit(): void {
    this.configFormGroup();

    const currentUrl = this.activateRoute.snapshot.url.join('/');

    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
      this.theBill = { status: 'pending', total_amount: 0 }; // Valores por defecto para crear
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    if (this.activateRoute.snapshot.params.id) {
      const billId = Number(this.activateRoute.snapshot.params.id);
      this.getBill(billId);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      issue_date: [
        null, // Se manejará con input type="datetime-local"
        [Validators.required]
      ],
      due_date: [
        null, // Se manejará con input type="datetime-local"
        [Validators.required]
      ],
      total_amount: [
        null,
        [
          Validators.required,
          Validators.min(0), // Para rules.unsigned()
          Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/) // Para números, opcionalmente con hasta 2 decimales
        ]
      ],
      status: [
        'pending', // Valor por defecto para el select
        [Validators.required, Validators.maxLength(255)]
      ]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getBill(id: number) {
    this.billService.view(id).subscribe({
      next: (data) => {
        this.theBill = data;
        this.theFormGroup.patchValue({
          // El input datetime-local espera "yyyy-MM-ddTHH:mm"
          // El backend envía 'yyyy-MM-dd HH:mm:ss', convertimos
          issue_date: this.theBill.issue_date ? DateTime.fromSQL(this.theBill.issue_date).toFormat("yyyy-MM-dd'T'HH:mm") : null,
          due_date: this.theBill.due_date ? DateTime.fromSQL(this.theBill.due_date).toFormat("yyyy-MM-dd'T'HH:mm") : null,
          total_amount: this.theBill.total_amount,
          status: this.theBill.status
        });
        if (this.mode === 1) {
          this.theFormGroup.disable();
        }
      },
      error: (error) => {
        console.error("Error fetching bill", error);
        Swal.fire('Error', 'No se pudo cargar la factura.', 'error');
        this.router.navigate(['/bills/list']);
      }
    });
  }

  // Método para formatear la fecha del input (que es 'yyyy-MM-ddTHH:mm')
  // al formato esperado por el backend ('yyyy-MM-dd HH:mm:ss')
  private formatDateTimeForBackend(isoDateTimeString: string | null | undefined): string | null {
    if (!isoDateTimeString) return null;
    try {
      return DateTime.fromISO(isoDateTimeString).toFormat('yyyy-MM-dd HH:mm:ss');
    } catch (e) {
      console.error("Error formatting date for backend:", e);
      return null;
    }
  }


  onSubmit(): void {
    if (this.mode === 2) {
      this.create();
    } else if (this.mode === 3) {
      this.update();
    }
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error de Validación', 'Por favor, complete todos los campos requeridos correctamente.', 'error');
      return;
    }

    // Validar que due_date sea posterior o igual a issue_date (opcional, pero buena práctica)
    const issueDate = DateTime.fromISO(this.theFormGroup.value.issue_date);
    const dueDate = DateTime.fromISO(this.theFormGroup.value.due_date);

    if (dueDate < issueDate) {
      Swal.fire('Error de Fechas', 'La fecha de vencimiento no puede ser anterior a la fecha de emisión.', 'error');
      return;
    }

    const billToCreate: Bill = {
      ...this.theFormGroup.value,
      issue_date: this.formatDateTimeForBackend(this.theFormGroup.value.issue_date)!,
      due_date: this.formatDateTimeForBackend(this.theFormGroup.value.due_date)!,
    };

    this.billService.create(billToCreate).subscribe({
      next: (data) => {
        Swal.fire('Creada', 'La factura ha sido creada exitosamente.', 'success');
        this.router.navigate(['/bills/list']);
      },
      error: (error) => {
        console.error("Error creating bill", error);
        let errorMessage = 'Ocurrió un error al crear la factura.';
        if (error.error) {
          errorMessage = this.formatAdonisError(error.error);
        }
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid && this.mode === 3) {
         if (this.theFormGroup.invalid) { // Mantenemos la validación estricta
            Swal.fire('Error de Validación', 'Por favor, revise los campos del formulario.', 'error');
            return;
         }
    }

    const issueDate = DateTime.fromISO(this.theFormGroup.value.issue_date);
    const dueDate = DateTime.fromISO(this.theFormGroup.value.due_date);

    if (dueDate < issueDate) {
      Swal.fire('Error de Fechas', 'La fecha de vencimiento no puede ser anterior a la fecha de emisión.', 'error');
      return;
    }

    const billToUpdate: Bill = {
      id: this.theBill.id,
      ...this.theFormGroup.value,
      issue_date: this.formatDateTimeForBackend(this.theFormGroup.value.issue_date)!,
      due_date: this.formatDateTimeForBackend(this.theFormGroup.value.due_date)!,
    };

    this.billService.update(billToUpdate).subscribe({
      next: (data) => {
        Swal.fire('Actualizada', 'La factura ha sido actualizada exitosamente.', 'success');
        this.router.navigate(['/bills/list']);
      },
      error: (error) => {
        console.error("Error updating bill", error);
        let errorMessage = 'Ocurrió un error al actualizar la factura.';
        if (error.error) {
          errorMessage = this.formatAdonisError(error.error);
        }
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  private formatAdonisError(errorResponse: any): string {
    if (errorResponse.errors && Array.isArray(errorResponse.errors) && errorResponse.errors.length > 0) {
      return errorResponse.errors.map((err: any) => err.message).join('<br>');
    }
    if (errorResponse.message && typeof errorResponse.message === 'string') {
      return errorResponse.message;
    }
    return 'Error desconocido del servidor.';
  }

  back() {
    this.router.navigate(['/bills/list']);
  }
}