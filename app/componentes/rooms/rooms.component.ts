import { Input } from '@angular/core';

import { ChatService } from 'src/app/services/chat.service';
import { AuthenticationService } from '../../services/authentication.service';
import { RoomService } from '../../services/room.service';

import { SpeechRecognitionService } from '../../services/speech-recognition.service';
import { Mensaje } from '../../interface/mensaje';
import { Usuario } from '../../interface/usuario';

import { Component } from '@angular/core';




@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
  providers: [SpeechRecognitionService]
})
export class RoomsComponent {

  mensaje: string = "";
  room: any;
  id: string = "QiLZu7Zn8rxrONM65B2X"; //ID SALA GENERAL POR DEFECTO PARA CARGARLAS
  @Input() selectedIndex: number = 0;
  @Input() public chatItems: Array<Mensaje> = [];
  @Input() public chatItemsPrivado: Array<Mensaje> = [];
  public _css: ChatService
  @Input() public listChatsPrivados: Array<Usuario> = [];
  public uid2: string = "";
  @Input() imagenSala: string = "../../assets/general.png";
  @Input() idiomaSala: string = "general";
  @Input() nivelSala: string = "";

  elemento: any;
  role: string;



  constructor(public _cs: ChatService, public _as: AuthenticationService, public _rs: RoomService, private speech: SpeechRecognitionService) {
    this._css = this._cs;

    this._css.getMensajes(this.id).subscribe((mensajes) => {
      this.chatItems = [];
      for (let mensaje of mensajes) {
        this.chatItems.push(mensaje);
      }
    });

    this._css.loadMensajes(this.id)
      .subscribe(() => {
      });


    this._rs.loadSalas().subscribe(() => {
    });


  }

  ngOnDestroy() {
    this.speech.stop;
  }

  ngOnInit() {

  }

  enviar_mensaje() {
    //validamos que haya mensaje
    if (this.mensaje.length === 0) {
      return;
    }
    this._cs.addMensaje(this.mensaje)
      .then(() => {
        this.mensaje = ""
      }
      )
      .catch((err) => console.error('Error enviando el mensaje', err));
  }

  grabar() {
    this.speech.record('es_ES').subscribe(e => this.mensaje = e);
    console.log(this.speech.grabando);
  }

  stop() {
    this.speech.stop();
    console.log(this.speech.grabando);
  }

  loadMensajes(id: string, idioma: string, imagen: string, nivel: string) {
    if (idioma == 'aa/general') {
      this.idiomaSala = "GENERAL";
      this.nivelSala = "";
    } else {
      this.idiomaSala = idioma.toUpperCase();
      this.nivelSala = nivel;
    }
    this.imagenSala = "../" + imagen;    
    this._cs.getMensajes(id).subscribe((catsSnapshot) => {
      this.chatItems = [];
      catsSnapshot.forEach((catData: Mensaje) => {
        this.chatItems.push(catData
        );
      })
    });
    return this.chatItems;
  }

  loadMensajesPrivados(uid2: any) {
    this.uid2 = uid2;
    this._cs.uid2 = uid2;
    this._cs.existeMiChatPrivado(uid2);
    setTimeout(() => {
      this._cs.getMChatPrivados().subscribe((catsSnapshot) => {
        this.chatItemsPrivado = catsSnapshot;
      });
      return this.chatItemsPrivado;
    }, 380)

  }

  public tabClick(event: any) {
    if (event.index == 0) {
      this._cs.getMensajes(this.id).subscribe((catsSnapshot) => {
        this.chatItems = [];
        catsSnapshot.forEach((catData: Mensaje) => {
          this.chatItems.push(catData
          );
        });
      });
      this.selectedIndex = 0;
    } else if (event.index == 1) {
      if (this.uid2 != "") {
        this.loadMensajesPrivados(this.uid2);
      }
      this._cs.getListChats();
    }
  }

  crearSala(idioma, nivel) {
    this._rs.crearSala(idioma, nivel);
  }

  borrarSala(id) {
    this._rs.borrarSala(id);
    this.chatItems = [];
  }

  hacerAdmin(uid){
    console.log(uid);
    this._as.hacerAdmin(uid).then(a=>{
      console.log(a);
    });
  }

  //CARGO CONVERSACION AL HACER CLICK SOBRE USUARIO DESDE LA SALA
  cambiarTab(uid2: string) {
    this.uid2 = uid2;
    this._cs.uid2 = uid2;
    this.loadMensajesPrivados(uid2);
    setTimeout(() => {
      this.selectedIndex = 1;
    }, 310)
  }

}





