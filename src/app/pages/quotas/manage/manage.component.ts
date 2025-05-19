// src/app/pages/quotas/manage/manage.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DateTime } from 'luxon';

import { Quota } from '../../../models/quota.model'; // Ajusta la ruta
import { QuotaService } from '../../../services/quota.service'; // Ajusta la ruta
import { Bill } from '../../../models/bill.model'; // Para el dropdown
import { BillService } from '../../../services/bill.service'; // Para cargar facturas
import { Service } from '../../../models/service.model'; // Para el dropdown
import { ServiceService } from '../../../services/service.service'; // Para cargar servicios

@Component({
  selector: 'app-quota-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number; // 1 - view, 2 - create, 3 - update
  theQuota!: Quota;
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  bills: Bill[] = [];
  services: Service[] = [];
  // Opciones para el estado de pago de la cuota
  paymentStatusOptions: string[] = ['pending', 'paid', 'partially_paid', 'overdue'];


  constructor(
    private activateRoute: ActivatedRoute,
    private quotaService: QuotaService,
    private billService: BillService,
    private serviceService: ServiceService,
    private router: Router,
    private readonly theFormBuilder: FormBuilder
  ) {
    this.mode = 1; // Default
  }

  ngOnInit(): void {
    this.loadBillsForDropdown();
    this.loadServicesForDropdown();
    this.configFormGroup();

    const currentUrl = this.activateRoute.snapshot.url.join('/');

    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
      this.theQuota = { amount: 0, payment_status: 'pending' }; // Valores por defecto
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    if (this.activateRoute.snapshot.params.id) {
      const quotaId = Number(this.activateRoute.snapshot.params.id);
      this.getQuota(quotaId);
    }
  }

  loadBillsForDropdown(): void {
    this.billService.list().subscribe({ // Asumiendo que tu BillService tiene un método list()
      next: (data) => this.bills = data,
      error: (err) => {
        console.error("Error loading bills", err);
        Swal.fire('Error', 'No se pudieron cargar las facturas.', 'error');
      }
    });
  }

  loadServicesForDropdown(): void {
    this.serviceService.list().subscribe({
      next: (data) => this.services = data,
      error: (err) => {
        console.error("Error loading services", err);
        Swal.fire('Error', 'No se pudieron cargar los servicios.', 'error');
      }
    });
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      amount: [
        null,
        [
          Validators.required,
          Validators.min(0), // Para rules.unsigned()
          Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)
        ]
      ],
      due_date: [
        null, // Se manejará con input type="datetime-local"
        [Validators.required]
      ],
      payment_status: [
        'pending', // Valor por defecto
        [Validators.required, Validators.maxLength(255)]
      ],
      bill_id: [
        null,
        [Validators.required]
      ],
      service_id: [
        null,
        [Validators.required]
      ]
    });
  }

  get getTheFormGroup() {
    return this.theFormGroup.controls;
  }

  getQuota(id: number) {
    this.quotaService.view(id).subscribe({
      next: (data) => {
        this.theQuota = data;
        this.theFormGroup.patchValue({
          amount: this.theQuota.amount,
          due_date: this.theQuota.due_date ? DateTime.fromSQL(this.theQuota.due_date).toFormat("yyyy-MM-dd'T'HH:mm") : null,
          payment_status: this.theQuota.payment_status,
          bill_id: this.theQuota.bill_id,
          service_id: this.theQuota.service_id
        });
        if (this.mode === 1) {
          this.theFormGroup.disable();
        }
      },
      error: (error) => {
        console.error("Error fetching quota", error);
        Swal.fire('Error', 'No se pudo cargar la cuota.', 'error');
        this.router.navigate(['/quotas/list']);
      }
    });
  }

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

    const quotaToCreate: Quota = {
      ...this.theFormGroup.value,
      due_date: this.formatDateTimeForBackend(this.theFormGroup.value.due_date)!,
    };

    this.quotaService.create(quotaToCreate).subscribe({
      next: (data) => {
        Swal.fire('Creada', 'La cuota ha sido creada exitosamente.', 'success');
        this.router.navigate(['/quotas/list']);
      },
      error: (error) => {
        console.error("Error creating quota", error);
        let errorMessage = 'Ocurrió un error al crear la cuota.';
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
         if (this.theFormGroup.invalid) {
            Swal.fire('Error de Validación', 'Por favor, revise los campos del formulario.', 'error');
            return;
         }
    }

    const quotaToUpdate: Quota = {
      id: this.theQuota.id,
      ...this.theFormGroup.value,
      due_date: this.formatDateTimeForBackend(this.theFormGroup.value.due_date)!,
    };

    this.quotaService.update(quotaToUpdate).subscribe({
      next: (data) => {
        Swal.fire('Actualizada', 'La cuota ha sido actualizada exitosamente.', 'success');
        this.router.navigate(['/quotas/list']);
      },
      error: (error) => {
        console.error("Error updating quota", error);
        let errorMessage = 'Ocurrió un error al actualizar la cuota.';
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
    this.router.navigate(['/quotas/list']);
  }
}