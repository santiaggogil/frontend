// src/app/pages/messages/manage/manage.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { DateTime } from 'luxon';

import { Message } from '../../../models/message.model';
import { MessageService } from '../../../services/message.service';
import { Chat } from '../../../models/chat.model';
import { ChatService } from '../../../services/chat.service';
// import { User } from '../../../models/user.model';
// import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-message-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number = 1;
  theMessage!: Message;
  theFormGroup!: FormGroup;
  trySend: boolean = false;
  chats: Chat[] = [];
  // users: User[] = [];

  constructor(
    private activateRoute: ActivatedRoute,
    private messageService: MessageService,
    private chatService: ChatService,
    // private userService: UserService,
    private router: Router,
    private readonly theFormBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.configFormGroup(); // Configurar primero
    this.loadChatsForDropdown();
    // this.loadUsersForDropdown();

    const currentUrl = this.activateRoute.snapshot.url.join('/');

    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
      const now = DateTime.now().toFormat("yyyy-MM-dd'T'HH:mm"); // Para prellenar sent_at
      this.theMessage = { content: '', sent_at: now, chat_id: undefined, user_id: '' };
      this.theFormGroup.patchValue({ sent_at: now }); // Prellenar el campo del formulario
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    if (this.activateRoute.snapshot.params.id) {
      const messageId = Number(this.activateRoute.snapshot.params.id);
      this.getMessage(messageId);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      content: [null, [Validators.required, Validators.maxLength(2000)]],
      sent_at: [null, [Validators.required]], // Campo para sent_at, tipo datetime-local
      chat_id: [null, [Validators.required]],
      user_id: [null, [Validators.required, Validators.maxLength(255)]]
    });

    if (this.mode === 3) { // Si es modo UPDATE
      this.fg.chat_id?.disable();
      this.fg.user_id?.disable();
      // Opcionalmente, podrías deshabilitar sent_at también en update si no debe cambiarse
      // this.fg.sent_at?.disable();
    }
  }

  loadChatsForDropdown(): void {
    this.chatService.list().subscribe({
      next: (data) => this.chats = data,
      error: (err) => {
        console.error("Error loading chats", err);
        Swal.fire('Error', 'No se pudieron cargar los chats.', 'error');
      }
    });
  }

  /*
  loadUsersForDropdown(): void {
    this.userService.list().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error("Error loading users", err)
    });
  }
  */

  get fg() {
    return this.theFormGroup.controls;
  }

  getMessage(id: number) {
    this.messageService.view(id).subscribe({
      next: (data) => {
        this.theMessage = data;
        this.theFormGroup.patchValue({
          content: this.theMessage.content,
          // Asumimos que sent_at viene del backend como un string ISO o yyyy-MM-dd HH:mm:ss
          sent_at: this.theMessage.sent_at ? DateTime.fromISO(this.theMessage.sent_at).toFormat("yyyy-MM-dd'T'HH:mm") : null,
          chat_id: this.theMessage.chat_id,
          user_id: this.theMessage.user_id
        });
        if (this.mode === 1) {
          this.theFormGroup.disable();
        } else if (this.mode === 3) {
            this.fg.chat_id?.disable();
            this.fg.user_id?.disable();
            // this.fg.sent_at?.disable(); // Si no se debe editar sent_at
        }
      },
      error: (error) => {
        console.error("Error fetching message", error);
        Swal.fire('Error', 'No se pudo cargar el mensaje.', 'error');
        this.router.navigate(['/messages/list']);
      }
    });
  }

  private formatDateTimeForBackend(isoDateTimeString: string | null | undefined): string | null {
    if (!isoDateTimeString) return null;
    try {
      // El input datetime-local devuelve 'yyyy-MM-ddTHH:mm'
      // Asumimos que el backend espera 'yyyy-MM-dd HH:mm:ss' si no se especifica formato en el validador
      // o si se quiere enviar con segundos.
      return DateTime.fromISO(isoDateTimeString).toFormat('yyyy-MM-dd HH:mm:ss');
    } catch (e) {
      console.error("Error formatting date for backend:", e, "Input was:", isoDateTimeString);
      return null;
    }
  }

  onSubmit(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error de Validación', 'Por favor, complete todos los campos requeridos correctamente.', 'error');
      Object.values(this.theFormGroup.controls).forEach(control => {
        control.markAsTouched();
      });
      return;
    }

    if (this.mode === 2) {
      this.create();
    } else if (this.mode === 3) {
      this.update();
    }
  }

  create() {
    const formValues = this.theFormGroup.value;
    const messageToCreate: Message = {
      content: formValues.content,
      sent_at: this.formatDateTimeForBackend(formValues.sent_at)!,
      chat_id: formValues.chat_id,
      user_id: formValues.user_id,
    };

    this.messageService.create(messageToCreate).subscribe({
      next: (data) => {
        Swal.fire('Enviado', 'El mensaje ha sido enviado exitosamente.', 'success');
        this.router.navigate(['/messages/list']);
      },
      error: (error) => {
        console.error("Error creating message", error);
        this.handleApiError(error, 'Ocurrió un error al enviar el mensaje.');
      }
    });
  }

  update() {
    const formValues = this.theFormGroup.getRawValue(); // Incluye campos deshabilitados

    const messageToUpdate: Message = {
      id: this.theMessage.id,
      content: formValues.content,
      sent_at: this.formatDateTimeForBackend(formValues.sent_at)!, // Si sent_at es editable
      // Si chat_id y user_id no son editables, toma los valores originales
      chat_id: this.theMessage.chat_id, // O formValues.chat_id si es editable
      user_id: this.theMessage.user_id, // O formValues.user_id si es editable
    };

    this.messageService.update(messageToUpdate).subscribe({
      next: (data) => {
        Swal.fire('Actualizado', 'El mensaje ha sido actualizado exitosamente.', 'success');
        this.router.navigate(['/messages/list']);
      },
      error: (error) => {
        console.error("Error updating message", error);
        this.handleApiError(error, 'Ocurrió un error al actualizar el mensaje.');
      }
    });
  }

  private handleApiError(error: any, defaultMessage: string): void {
    let errorMessage = defaultMessage;
    if (error.error && error.error.message) {
        errorMessage = error.error.message;
    } else if (error.error && error.error.errors && Array.isArray(error.error.errors) && error.error.errors.length > 0) {
        errorMessage = error.error.errors.map((err: any) => err.message).join('<br>');
    }
    Swal.fire('Error', errorMessage, 'error');
  }

  back() {
    if (this.theMessage && this.theMessage.chat_id) {
      this.router.navigate(['/chats', this.theMessage.chat_id]);
    } else {
      this.router.navigate(['/chats/list']);
    }
  }
}