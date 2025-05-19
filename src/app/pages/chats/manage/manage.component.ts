// src/app/pages/chats/manage/manage.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { Chat } from '../../../models/chat.model'; // Ajusta la ruta
import { ChatService } from '../../../services/chat.service'; // Ajusta la ruta

@Component({
  selector: 'app-chat-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit {

  mode: number = 1; // 1 - view, 2 - create, 3 - update
  theChat!: Chat;
  theFormGroup!: FormGroup;
  trySend: boolean = false;

  constructor(
    private activateRoute: ActivatedRoute,
    private chatService: ChatService,
    private router: Router,
    private readonly theFormBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.configFormGroup();

    const currentUrl = this.activateRoute.snapshot.url.join('/');

    if (currentUrl.includes('view')) {
      this.mode = 1;
    } else if (currentUrl.includes('create')) {
      this.mode = 2;
      this.theChat = { name: '' }; // Valores iniciales
    } else if (currentUrl.includes('update')) {
      this.mode = 3;
    }

    if (this.activateRoute.snapshot.params.id) {
      const chatId = Number(this.activateRoute.snapshot.params.id);
      this.getChat(chatId);
    }
  }

  configFormGroup() {
    this.theFormGroup = this.theFormBuilder.group({
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3), // Ejemplo de validación mínima
          Validators.maxLength(100) // Ejemplo de validación máxima
          // Si tienes una regla 'unique' en la BD para el nombre, se validará en backend
        ]
      ]
    });
  }

  get fg() { // Getter para acceder a los controles del formulario fácilmente
    return this.theFormGroup.controls;
  }

  getChat(id: number) {
    this.chatService.view(id).subscribe({
      next: (data) => {
        this.theChat = data;
        this.theFormGroup.patchValue({
          name: this.theChat.name,
        });
        if (this.mode === 1) {
          this.theFormGroup.disable();
        }
      },
      error: (error) => {
        console.error("Error fetching chat", error);
        Swal.fire('Error', 'No se pudo cargar el chat.', 'error');
        this.router.navigate(['/chats/list']); // Ajusta la ruta de listado
      }
    });
  }

  onSubmit(): void {
    this.trySend = true;
    if (this.theFormGroup.invalid) {
      Swal.fire('Error de Validación', 'Por favor, complete el nombre correctamente.', 'error');
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
    const chatToCreate: Chat = {
      ...this.theFormGroup.value,
    };

    this.chatService.create(chatToCreate).subscribe({
      next: (data) => {
        Swal.fire('Creado', 'El chat ha sido creado exitosamente.', 'success');
        this.router.navigate(['/chats/list']); // Ajusta la ruta
      },
      error: (error) => {
        console.error("Error creating chat", error);
        let errorMessage = 'Ocurrió un error al crear el chat.';
        // Asumimos que el backend puede enviar errores formateados si hay, por ejemplo, un 'unique constraint'
        if (error.error && error.error.message) {
            errorMessage = error.error.message;
        } else if (error.error && error.error.errors && Array.isArray(error.error.errors) && error.error.errors.length > 0) {
            errorMessage = error.error.errors.map((err: any) => err.message).join('<br>');
        }
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  update() {
    const chatToUpdate: Chat = {
      id: this.theChat.id,
      ...this.theFormGroup.value,
    };

    this.chatService.update(chatToUpdate).subscribe({
      next: (data) => {
        Swal.fire('Actualizado', 'El chat ha sido actualizado exitosamente.', 'success');
        this.router.navigate(['/chats/list']); // Ajusta la ruta
      },
      error: (error) => {
        console.error("Error updating chat", error);
        let errorMessage = 'Ocurrió un error al actualizar el chat.';
        if (error.error && error.error.message) {
            errorMessage = error.error.message;
        } else if (error.error && error.error.errors && Array.isArray(error.error.errors) && error.error.errors.length > 0) {
            errorMessage = error.error.errors.map((err: any) => err.message).join('<br>');
        }
        Swal.fire('Error', errorMessage, 'error');
      }
    });
  }

  back() {
    this.router.navigate(['/chats/list']); // Ajusta la ruta
  }
}
