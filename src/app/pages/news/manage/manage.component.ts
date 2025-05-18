import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { New } from 'src/app/models/new.model'; // CAMBIADO
import { NewService } from 'src/app/services/new.service'; // CAMBIADO (asegúrate que este servicio exista)

@Component({
  selector: 'app-manage-new', // Selector actualizado
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'] // Puedes usar el mismo SCSS o uno específico
})
export class ManageNewComponent implements OnInit { // Nombre de clase actualizado

  mode: number = 1; // 1 - view, 2 - create, 3 - update
  currentNewsItem!: New; // CAMBIADO el tipo y nombre de la variable
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  isLoading: boolean = true; // Para mostrar "Cargando..."

  constructor(
    private activateRoute: ActivatedRoute,
    private newService: NewService, // CAMBIADO el servicio
    private router: Router,
    private fb: FormBuilder
  ) {
    this.currentNewsItem = {}; // Inicializar
    // No llamamos configFormGroup aquí para evitar que se ejecute antes de tener datos o saber el modo
  }

  ngOnInit(): void {
    this.determineMode();
    const idFromRoute = this.activateRoute.snapshot.params['id'];

    if (this.mode === 2) { // Modo Crear
      this.configFormGroup();
      this.isLoading = false;
    } else if ((this.mode === 1 || this.mode === 3) && idFromRoute) { // Modo Vista o Actualizar
      this.getNewsItem(+idFromRoute);
    } else if (this.mode === 1 && !idFromRoute) { // Modo Vista sin ID (error de ruta o lógica)
      Swal.fire('Error', 'No se proporcionó ID para ver la novedad.', 'error');
      this.router.navigate(['/news/list']); // CAMBIAR RUTA si es necesario
      this.isLoading = false;
    } else {
      // Caso inesperado, podría ser modo create sin la URL correcta.
      // Redirigir o mostrar error.
      this.router.navigate(['/news/list']); // CAMBIAR RUTA si es necesario
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
        // Para 'update', el valor inicial vendrá formateado. Para 'create', será ''.
        // El input tipo 'date' necesita 'YYYY-MM-DD'
        newsData?.reported_at ? this.formatDateForInput(newsData.reported_at) : '',
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
    // En modo actualización, podrías querer deshabilitar ciertos campos (ej. shift_id si no debe cambiar)
    // if (this.mode === 3 && this.formControls.shift_id) {
    //   this.formControls.shift_id.disable();
    // }
  }

  // Función para formatear la fecha a YYYY-MM-DD para el input type="date"
  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    try {
      // Intenta parsear la fecha. Si ya está en YYYY-MM-DD, Date lo manejará.
      // Si es un ISO string completo, también.
      const date = new Date(dateString);
      // Ajuste para zona horaria: Si el backend devuelve UTC y el input espera local,
      // podrías tener un día de diferencia. `toISOString().split('T')[0]` es robusto
      // si la fecha del backend es una representación de "fecha" sin hora específica o en UTC.
      // Si la fecha del backend es local, y se parsea como local, esto funciona:
      // const year = date.getFullYear();
      // const month = ('0' + (date.getMonth() + 1)).slice(-2);
      // const day = ('0' + date.getDate()).slice(-2);
      // return `${year}-${month}-${day}`;

      // La forma más segura si el backend envía ISO (o algo que `new Date` interpreta como UTC por defecto si no hay offset)
      // y queremos el día "calendario" sin importar la zona horaria del cliente para el input:
      // Si reported_at del backend es '2023-10-27' (solo fecha), `new Date('2023-10-27')` puede interpretarlo como UTC 00:00.
      // Si es '2023-10-27T00:00:00Z', es explícitamente UTC.
      // Para evitar problemas con zonas horarias al convertir a YYYY-MM-DD para el input:
      if (dateString.includes('T')) { // Si es un datetime completo
        return date.toISOString().split('T')[0];
      } else { // Si es solo una cadena de fecha como 'YYYY-MM-DD' o 'MM/DD/YYYY'
        // new Date() puede ser inconsistente aquí. Es mejor si el backend ya da YYYY-MM-DD o ISO.
        // Asumiendo que si no tiene 'T', ya es algo que el input 'date' podría tomar o es YYYY-MM-DD
        const parts = dateString.split(/[-/]/); // Manejar separadores comunes
        if (parts.length === 3) {
            // Intenta reordenar si es necesario, o asumir YYYY-MM-DD
            // Esta parte puede necesitar ajuste según el formato exacto de `reported_at` si no es ISO
            if (parts[0].length === 4) return dateString; // Asumir YYYY-MM-DD
        }
        // Fallback a la conversión ISO, puede tener off-by-one por timezone si la original no era UTC
        return new Date(dateString).toISOString().split('T')[0];
      }

    } catch (e) {
      console.error("Error formateando fecha: ", dateString, e);
      return ''; // Retorna vacío si hay error de formato
    }
  }

  getNewsItem(id: number) {
    this.isLoading = true;
    this.newService.view(id).subscribe({
      next: (responseData: New) => {
        this.currentNewsItem = responseData;
        this.configFormGroup(this.currentNewsItem); // Configura el form con los datos
        this.isLoading = false;
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo cargar la novedad.';
        Swal.fire('Error', errorMessage, 'error');
        this.router.navigate(['/news/list']); // CAMBIAR RUTA si es necesario
        this.isLoading = false;
      }
    });
  }

  get formControls() {
    return this.theFormGroup.controls;
  }

  back() {
    this.router.navigate(['/news/list']); // CAMBIAR RUTA si es necesario
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
        control.markAsDirty(); // o markAsTouched()
        control.updateValueAndValidity(); // para que se muestren los errores
      });
      return;
    }

    const formValues = this.theFormGroup.value;
    const dataToCreate: New = {
      title: formValues.title,
      description: formValues.description,
      reported_at: formValues.reported_at, // El input date ya da YYYY-MM-DD
      shift_id: +formValues.shift_id // Convertir a número
    };

    this.newService.create(dataToCreate).subscribe({
      next: () => {
        Swal.fire('Creada', "Novedad creada correctamente.", 'success');
        this.router.navigate(['/news/list']); // CAMBIAR RUTA si es necesario
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

    // Usar getRawValue() para incluir campos deshabilitados si fuera necesario,
    // pero para 'New' probablemente no haya campos deshabilitados que se quieran enviar (excepto 'id' que se toma de currentNewsItem).
    // Si 'shift_id' se deshabilita en update, y quieres enviar su valor original, getRawValue() es útil.
    const formValues = this.theFormGroup.getRawValue();

    const dataToUpdate: New = {
      id: this.currentNewsItem.id, // El ID viene del objeto cargado
      title: formValues.title,
      description: formValues.description,
      reported_at: formValues.reported_at, // El input date ya da YYYY-MM-DD
      shift_id: +formValues.shift_id // Convertir a número
    };

    this.newService.update(dataToUpdate).subscribe({
      next: () => {
        Swal.fire('Actualizada', "Novedad actualizada correctamente.", 'success');
        this.router.navigate(['/news/list']); // CAMBIAR RUTA si es necesario
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'No se pudo actualizar la novedad.';
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }
}
