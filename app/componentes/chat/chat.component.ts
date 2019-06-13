import { Component, OnInit } from '@angular/core';

import { SpeechRecognitionService } from '../../services/speech-recognition.service'
import { ChatService } from 'src/app/services/chat.service';
import { AuthenticationService} from '../../services/authentication.service';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  providers: [SpeechRecognitionService],
  styles: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  mensaje: string = "";
  elemento: any;

  constructor(public _cs: ChatService, public _as: AuthenticationService, private speech: SpeechRecognitionService) {
    /*this._cs.loadMensajes()
      .subscribe(() => {
        //pongo este retardo para que le de tiempo a cargar mensajes del server
        setTimeout(() => {
          this.elemento.scrollTop = this.elemento.scrollHeight;
        }, 25);
      });     */ 
  }

  grabar(){
    this.speech.record('es_ES').subscribe(e => this.mensaje = e);
  }

  stop(){
    this.speech.stop();
  }

  ngOnInit() {
    this.elemento = document.getElementById('app-mensajes');
    this.elemento.scrollTop= this.elemento.scrollHeight;
  }

  enviar_mensaje() {
    console.log(this.mensaje);

    //validamos que haya mensaje
    if (this.mensaje.length === 0) {
      return;
    }
    this._cs.addMensaje(this.mensaje)
      .then(() => this.mensaje = "")
      .catch((err) => console.error('Error enviando el mensaje', err));

  }

}
