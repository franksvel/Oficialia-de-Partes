import { Component } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  standalone: false,
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'] // ← corrección aquí
})
export class ChatbotComponent {
  userMessage = '';
  isOpen = false;
  messages: { text: string, from: 'user' | 'bot' }[] = [];

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;

    this.messages.push({ text: this.userMessage, from: 'user' });

    setTimeout(() => {
      const botReply = this.getBotResponse(this.userMessage);
      this.messages.push({ text: botReply, from: 'bot' });
    }, 500);

    this.userMessage = '';
  }

  getBotResponse(message: string): string {
    message = message.toLowerCase();

    if (message.includes('hola')) return '¡Hola! ¿En qué puedo ayudarte con la oficialía de partes?';
    if (message.includes('oficio')) return 'Puedes consultar los oficios enviados y recibidos en el panel principal. También puedes registrar uno nuevo desde el botón "Nuevo Oficio".';
    if (message.includes('enviar')) return 'Para enviar un oficio, ve a la sección "Nuevo Oficio", llena los campos requeridos y haz clic en "Enviar".';
    if (message.includes('recibido') || message.includes('recepción')) return 'Puedes ver los oficios recibidos en la pestaña "Oficios Recibidos". Los nuevos aparecen primero.';
    if (message.includes('estatus') || message.includes('estado')) return 'Para consultar el estado de un oficio, busca el número de folio en la tabla de oficios y revisa la columna de estatus.';
    if (message.includes('adjuntar') || message.includes('archivo')) return 'Puedes adjuntar archivos al registrar un oficio, en el campo "Adjuntar documento".';
    if (message.includes('ayuda')) return 'Claro, puedo ayudarte con el registro, envío, recepción y seguimiento de oficios. Pregúntame lo que necesites.';

    return '¡Hola! ¿En qué puedo ayudarte con la oficialía de partes?';
  }
}
