import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';

import { Mensaje } from '../interface/mensaje';
import { Usuario } from '../interface/usuario';


@Injectable({
  providedIn: 'root'
})

export class ChatService {
  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  public chats: Array<Mensaje> = [];     
  public usuario: any = {};  //info que retorna la autenticacion (google)
  public id: string = "";
  public listChats: Array<Usuario> = [];
  public ref: any = "" //ID del doc
  public uid2: string = "";
  public datos_user: Usuario = null;


  constructor(private afs: AngularFirestore, public afAuth: AngularFireAuth, private af: AngularFireDatabase) {

    //para comunicar cualquier cambio del perfil del usuario
    this.afAuth.authState.subscribe(user => {
      //console.log('Estado del usuario: ', user);
      if (!user) {
        return;
      }
      this.usuario.displayName = user.displayName;
      this.usuario.uid = user.uid;//clave unica
      this.usuario.photoURL = user.photoURL;
      this.usuario.email = user.email;
    });

    
    
  }

  //CARGAR MENSAJES DE CADA SALA  
  loadMensajes(id: string) {
    this.id= id;
    this.itemsCollection = this.afs.collection<Mensaje>('rooms/' + id + '/mensajes', ref => ref.orderBy('fecha', 'asc').limit(100));
    //aqui mandamos el query a firebase para cargar solo los ultimos 100 mensajes
    //pendiente de todos los cambios del chat
    //mediante observable y me subscribo en el chat component que 
    //es donde quiero recibirlo.        
    return this.itemsCollection.valueChanges()
      .pipe(map((mensajes: Mensaje[]) => {
        //console.log("itemscollection length: " + mensajes.length + "en: " + idioma);
        //console.table(mensajes);
        this.chats = [];
        //this.listChats = null;
        for (let mensaje of mensajes) {
          //this.listChats.next(mensaje);
          //console.table(mensaje);
          this.chats.push(mensaje);
          this.chats.unshift(mensaje);
        }
        //return this.listChats;
        return this.chats;
        //this.chats = mensajes;
      }));
  }

  getMensajes(id: string): any {
    this.itemsCollection = this.afs.collection<Mensaje>('rooms/' + id + '/mensajes', ref => ref.orderBy('fecha', 'asc').limit(100));
    return this.itemsCollection.valueChanges();
  }

  addMensaje(text: string) {
    let mensaje: Mensaje = {
      uid: this.usuario.uid,
      displayName: this.usuario.displayName,
      mensaje: text,
      fecha: new Date().getTime(),
      photoURL: this.usuario.photoURL
    }
    return this.itemsCollection.add(mensaje);
  }
  /////FIN CARGA SALA


  cargarChatPrivado(uid2:string){
    this.uid2 = uid2;
    
  }


  /*CHATS PRIVADOS*/ 
  existeMiChatPrivado(uid2: string) {
    this.uid2 = uid2;
    var encontrado = false;
    this.afs.collection<Mensaje>('private').get().toPromise().then(snapshot => {
      snapshot.forEach(doc => {
        //AQUI TENGO LOS NOMBRES DE USUARIOS
        if ((doc.id.includes(uid2)) && (doc.id.includes(this.usuario.uid)) && !encontrado) {
          this.ref = doc.id;
          //añado en listChats los DOCs ID de las salas en las que participo
          encontrado = true;
          console.table("estoy en mi chat privado")
          //this.getMChatPrivados();
          return;
        }
        
      });//Si llego aqui con encontrado a false es que no existe el chat Y TENGO QUE CREARLO
      if (!encontrado) {
        this.ref = this.usuario.uid + "_" + uid2;
        this.afs.collection('private').doc(this.ref).set({});
        //this.listUIDs.push(this.ref); //añado la ref aqui
        //this.getMChatPrivados();
        return;
      }           
    })    
  }
  
  getMChatPrivados() {
      this.getUserByUID(this.uid2)
    .subscribe(result => {
      result.forEach((catData: any) => {
            let user: Usuario = {
              uid: catData.uid,
              displayName: catData.displayName,
              photoURL: catData.photoURL,
              email: catData.email,
              role: catData.role
            }           
            this.datos_user = user;
      })
    })
    this.itemsCollection = this.afs.collection<Mensaje>('private').doc(this.ref).collection('mensajes', ref => ref.orderBy('fecha', 'asc').limit(100));
    return this.itemsCollection.valueChanges()
      .pipe(map((mensajes: Mensaje[]) => {
        this.chats = [];
        for (let mensaje of mensajes) {
          this.chats.push(mensaje);         
        }
        //console.table("THIS.CHATS LENGTH" + this.chats.length);
        return this.chats;
      }));
}

getListChats(){
  this.afs.collection<Mensaje>('private').get().toPromise().then(snapshot => {
    snapshot.forEach(doc => {
      if ((doc.id.includes(this.usuario.uid))) {
        //si lo encuentro, es que tiene chat abierto
        //necesito trocearlo y añadirlo en lis
        var e = doc.id.toString().slice(0, 28);
        if (e == this.usuario.uid) {
          var e = doc.id.toString().slice(29, 64);
    }//ya tengo en E el uid2 de cada chat, necesito conocer los datos del user.
    this.getUserByUID(e)
    .subscribe(result => {
      result.forEach((catData: any) => {        
          // ya tengo aquí cada user.
            let user: Usuario = {
              uid: catData.uid,
              displayName: catData.displayName,
              photoURL: catData.photoURL,
              email: catData.email,
              role: catData.rol
            }            
            if (!this.listChats.some(ob => ob['uid'] === catData.uid)) {
              this.listChats.push(user); // aqui controlo que se agregue una vez solo cada user         
              return this.listChats;
            }   
      })
    })
      } 
    })
  })
}
  
  getUserByUID(uid: string) {
      return this.afs.collection<Usuario>('users', ref=> ref.where('uid','==', uid)).valueChanges();      
  }

  

  

}
  


