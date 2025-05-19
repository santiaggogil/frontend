import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { New } from 'src/app/models/new.model';
import { NewService } from 'src/app/services/new.service';

@Component({
  selector: 'app-manage-new',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageNewComponent implements OnInit {

  mode: number = 1; // 1 - view, 2 - create, 3 - update
  currentNewsItem!: New;
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  isLoading: boolean = true;

  constructor(
    private activateRoute: ActivatedRoute,
    private newService: NewService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.currentNewsItem = {}; // Inicializar
  }

  ngOnInit(): void {
    this.determineMode();
    const idFromRoute = this.activateRoute.snapshot.params['id'];

    if (this.mode === 2) { // Modo Crear
      this.configFormGroup();
      this.isLoading = false;
    } else if ((this.mode === 1 || this.mode === 3) && idFromRoute) { // Modo Vista o Actualizar
      this.getNewsItem(+idFromRoute);
    } else if (this.mode === 1 && !idFromRoute) { // Modo Vista sin ID
      Swal.fire('Error', 'No se proporcionó ID para ver la novedad.', 'error');
      this.router.navigate(['/news/list']);
      this.isLoading = false;
    } else {
      this.router.navigate(['/news/list']);
      this.isLoading = false;
    }
  }

  determineMode(): void {
    const currentUrl = this.activateRoute.snapshot.url.join('/');
    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }
  }

  configFormGroup(newsData?: New) {
    this.theFormGroup = this.fb.group({
      title: [
        newsData?.title || '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(100)]
      ],
      description: [
        newsData?.description || '',
        [Validators.required, Validators.maxLength(500)]
      ],
      reported_at: [
        // Aquí formateamos lo que viene del backend para el input date
        newsData?.reported_at ? this.formatDateTimeToInputDate(newsData.reported_at) : '',
        [Validators.required]
      ],
      shift_id: [
        newsData?.shift_id || null,
        [Validators.required, Validators.min(1)]
      ]
    });

    if (this.mode === 1) { // Modo Vista
      this.theFormGroup.disable();
    }
  }

  /**
   * Formatea una cadena DateTime (ISO o similar) a 'YYYY-MM-DD' para el input type="date".
   */
  private formatDateTimeToInputDate(dateTimeString: string | Date): string {
    if (!dateTimeString) return '';
    try {
      // Crear un objeto Date. new Date() es bastante bueno parseando formatos ISO.
      const dateObj = new Date(dateTimeString);

      // Para evitar problemas de zona horaria al extraer partes, usamos los métodos UTC
      // o convertimos a ISO y tomamos la primera parte.
      // toISOString() devuelve YYYY-MM-DDTHH:mm:ss.sssZ
      return dateObj.toISOString().split('T')[0];
    } catch (e) {
      console.error("Error formateando DateTime a InputDate: ", dateTimeString, e);
      // Si falla el parseo, intentar devolver la cadena original si ya es YYYY-MM-DD
      if (typeof dateTimeString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateTimeString)) {
        return dateTimeString;
      }
      return '';
    }
  }

  /**
   * Formatea una cadena 'YYYY-MM-DD' (del input) a una cadena DateTime ISO
   * (YYYY-MM-DDTHH:mm:ss.sssZ) para enviar al backend.
   * Se asume medianoche UTC.
   */
  private formatDateToDateTimeISO(dateString: string): string | null {
    if (!dateString) return null;
    try {
      // Validar que sea YYYY-MM-DD
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        console.error("Formato de fecha inválido para convertir a DateTime ISO:", dateString);
        return null; // O lanzar un error
      }
      // Esto crea un objeto Date para la medianoche en la zona horaria LOCAL del navegador.
      // Al usar toISOString(), se convierte a UTC.
      // Por ejemplo, si dateString es "2023-10-27" y el navegador está en GMT-5:
      // new Date("2023-10-27") es "2023-10-27T00:00:00.000-05:00"
      // .toISOString() lo convierte a "2023-10-27T05:00:00.000Z"

      // Si quieres que SIEMPRE sea T00:00:00.000Z (medianoche UTC), es más directo:
      return `${dateString}T00:00:00.000Z`;

      // Si prefieres que sea medianoche en la zona local del usuario y luego convertir a UTC:
      // const localDate = new Date(dateString);
      // return localDate.toISOString();
      // ¡CUIDADO! Esto puede hacer que la fecha *en UTC* cambie al día anterior o siguiente
      // dependiendo de la zona horaria del usuario.
      // Ejemplo: "2023-10-27" en Australia (GMT+10) se convierte a new Date(...)
      // que es 2023-10-27T00:00:00+10:00. En ISOString UTC, es 2023-10-26T14:00:00Z.
      // Por eso, `${dateString}T00:00:00.000Z` es generalmente más seguro si el backend
      // espera una fecha y la hora no importa o debe ser el inicio del día UTC.

    } catch (e) {
      console.error("Error formateando Date a DateTime ISO: ", dateString, e);
      return null;
    }
  }


  getNewsItem(id: number) {
    this.isLoading = true;
    this.newService.view(id).subscribe({
      next: (responseData: New) => {
        this.currentNewsItem = responseData;
        this.configFormGroup(this.currentNewsItem);
        this.isLoading = false;
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo cargar la novedad.';
        Swal.fire('Error', errorMessage, 'error');
        this.router.navigate(['/news/list']);
        this.isLoading = false;
      }
    });
  }

  get formControls() {
    return this.theFormGroup.controls;
  }

  back() {
    this.router.navigate(['/news/list']);
  }

  handleSubmit() {
    if (this.mode === 2) {
      this.create();
    } else if (this.mode === 3) {
      this.update();
    }
  }

  create() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos requeridos correctamente.', 'error');
      Object.values(this.formControls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    const formValues = this.theFormGroup.value;
    const formattedReportedAt = this.formatDateToDateTimeISO(formValues.reported_at);

    if (!formattedReportedAt) {
        Swal.fire('Error de Fecha', 'La fecha de reporte no es válida.', 'error');
        this.formControls['reported_at'].setErrors({'invalidDate': true});
        return;
    }

    const dataToCreate: New = {
      title: formValues.title,
      description: formValues.description,
      reported_at: formattedReportedAt, // Enviamos la fecha formateada como DateTime ISO
      shift_id: +formValues.shift_id
    };

    this.newService.create(dataToCreate).subscribe({
      next: () => {
        Swal.fire('Creada', "Novedad creada correctamente.", 'success');
        this.router.navigate(['/news/list']);
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo crear la novedad.';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  update() {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Formulario Inválido', 'Por favor, complete todos los campos editables requeridos correctamente.', 'error');
      Object.values(this.formControls).forEach(control => {
        if (control.enabled) {
          control.markAsDirty();
          control.updateValueAndValidity();
        }
      });
      return;
    }

    const formValues = this.theFormGroup.getRawValue();
    const formattedReportedAt = this.formatDateToDateTimeISO(formValues.reported_at);

    if (!formattedReportedAt) {
        Swal.fire('Error de Fecha', 'La fecha de reporte no es válida.', 'error');
        this.formControls['reported_at'].setErrors({'invalidDate': true});
        return;
    }

    const dataToUpdate: New = {
      id: this.currentNewsItem.id,
      title: formValues.title,
      description: formValues.description,
      reported_at: formattedReportedAt, // Enviamos la fecha formateada como DateTime ISO
      shift_id: +formValues.shift_id
    };

    this.newService.update(dataToUpdate).subscribe({
      next: () => {
        Swal.fire('Actualizada', "Novedad actualizada correctamente.", 'success');
        this.router.navigate(['/news/list']);
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo actualizar la novedad.';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }
}
