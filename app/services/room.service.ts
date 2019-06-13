import { Injectable, OnInit, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';

import { Mensaje } from '../interface/mensaje';
import { Room } from '../interface/room';
import { ChatService } from '../services/chat.service';


@Injectable({
    providedIn: 'root'
})

export class RoomService implements OnInit {
    private roomsCollection: AngularFirestoreCollection<Room>;
    public room: any = {};
    public rooms: Room[] = [];


    private itemsCollection: AngularFirestoreCollection<Mensaje>;
    public chats: Mensaje[] = [];

    idiomas = ['Inglés', 'Español', 'Francés',
        'Alemán', 'Italiano'];

    niveles = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];


    constructor(private af: AngularFireDatabase, private afs: AngularFirestore, private _cs: ChatService) {
    }

    ngOnInit() {
        this.loadSalas();
    }

    loadSalas() {
        this.roomsCollection = this.afs.collection<Room>('rooms', ref=>ref.orderBy('idioma', 'asc'));
        return this.roomsCollection.valueChanges()
            .pipe(map((rooms: Room[]) => {
                for (let room of rooms) {
                    this.rooms.unshift(room);                   
                }
                //return this.rooms;
                this.rooms = rooms;
            }))
    }

    crearSala(idioma, nivel) {
        var imagen = "";
        var idioma_format;
        var id = this.afs.createId();
        switch (idioma) {
            case "Inglés": {
                imagen = "../assets/ingles.png";
                idioma_format = "ingles";
                break;
            }
            case "Español": {
                imagen = "../assets/español.png";
                idioma_format = "español";
                break;
            }
            case "Francés": {
                imagen = "../assets/frances.png";
                idioma_format = "frances";
                break;
            }
            case "Alemán": {
                imagen = "../assets/aleman.png";
                idioma_format = "aleman";
                break;
            }
            case "Italiano": {
                imagen = "../assets/italiano.png";
                idioma_format = "italiano";
                break;
            }
        }
        //cargar banderas
        let room: Room = {
            idioma: idioma_format,
            imagen: imagen,
            nivel: nivel,
            id: id
        }
        return this.afs.collection<Room>('rooms').doc(id).set(room);
    }

    borrarSala(id){
        this.afs.collection<Room>('rooms').doc(id).delete();
        
    }

  

    loadMensajesSala(id: string) {
        this._cs.id = id;
        this.itemsCollection = this.afs.collection<Mensaje>('rooms/id/mensajes', ref => ref.orderBy('fecha', 'desc').limit(100));
        //aqui mandamos el query a firebase para cargar solo los ultimos 100 mensajes

        //pendiente de todos los cambios del chat
        //mediante observable y me subscribo en el chat component que 
        //es donde quiero recibirlo.
        return this.itemsCollection.valueChanges()
            .pipe(map((mensajes: Mensaje[]) => {
                console.log(mensajes);
                this.chats = [];
                for (let mensaje of mensajes) {
                    this.chats.unshift(mensaje);
                }
                return this.chats;
                //this.chats = mensajes;
            }))




    }
   
}
