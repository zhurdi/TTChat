import { Injectable, Output, } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { Observable, } from 'rxjs';
import { _sanitizeHtml } from '@angular/core/src/sanitization/html_sanitizer';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Usuario } from '../interface/usuario';
import { map } from 'rxjs/operators';

import { Perfil } from '../interface/perfil';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  //info que retorna la autenticacion (google, twitter)
  @Output() public usuario: any = {}

  public usersCollection: AngularFirestoreCollection<Usuario>;
  public users: Observable<Usuario[]>;
  public role: string;


  constructor(private _snackBar: MatSnackBar, private afs: AngularFirestore, public afAuth: AngularFireAuth, private _router: Router) {


    //para comunicar cualquier cambio del perfil del usuario
    this.afAuth.authState.subscribe(user => {
      if (!user) {
        return;
      }
      this.usuario.displayName = user.displayName;
      this.usuario.uid = user.uid;//clave unica
      this.usuario.photoURL = user.photoURL;
      this.usuario.email = user.email;
      this.usuario.password = user.updatePassword
      //this.usuario = afAuth.authState;
      console.log("displayname: " + user.displayName + " photo: " + user.photoURL + " uid: " + user.uid)
      this.getRole(this.usuario.uid).subscribe((a) => {
        a.forEach((cat: any) => {
          var user = cat.payload.doc.data() as Usuario
          this.role = user.role;
        })
      })
    })
    this.usuario = afAuth.authState;
    this.usersCollection = this.afs.collection('users');
  }


  actualizarPerfilUsuario(nombre: string, email: string) {
    this.afAuth.auth.currentUser.updateEmail(email);
    this.afAuth.auth.currentUser.updateProfile({
      displayName: nombre
    });
    var usuario = {
      displayName: nombre,
      email: email,
      photoURL: this.usuario.photoURL,
      uid: this.usuario.uid,
      role: this.role
    }
    return this.afs.collection<Usuario>('users', ref => ref.where('uid', '==', this.usuario.uid)).snapshotChanges().pipe(map(actions => {
      actions.map(a => {
        var id = a.payload.doc.id;
        this.afs.collection<Usuario>('users').doc(id).set(usuario).then(a => {
        });
      });
    }));
  }

  actualizarContraseña(pass: string) {
    return this.afAuth.auth.currentUser.updatePassword(pass);
  }

  actualizarFotoUsuario(foto: string) {
    return this.afAuth.auth.currentUser.updateProfile({
      photoURL: foto
    })
  }

  login() { //Loguin con GOOGLE
    var encontrado = false;
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then(value => {
      var usuario = {
        displayName: value.user.displayName,
        email: value.user.email,
        photoURL: value.user.photoURL,
        uid: value.user.uid
      }
      this.getUsers().subscribe((user: Usuario[]) => {
        user.map((user => {
          if (user.uid == usuario.uid) {
            encontrado = true;
            return;
          }
        }));
      });
      setTimeout(() => {
        if (!encontrado) {
          this.createUser(usuario);// creo el user si no existe
        }
      }, 1310)

      this.openSnackBar("Logueado correctamente", '');
      this._router.navigate(['/', 'rooms']);
    })
      .catch(err => {
        //console.log("Error a la hora de loguerase con gmail" + err);
      })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 1300,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    })
  }

  logout() {
    this.afAuth.auth.signOut().then(a => {
      this.usuario = {};
    });
    this.usuario = {};
    this._router.navigate(['/', 'login']);
  }

  loginEmail(email: string, password: string) { //LOGUEARSE CON USER/PASS
    console.log("desde auth: " + email + " " + password)
    return this.afAuth.auth.signInWithEmailAndPassword("" + email, "" + password)
      .then(value => {
        //this._router.navigate(['/','rooms']);        
        console.log("estoy en login " + value.user.displayName);
        return value.user;
      })
      .catch(err => {
        console.log('Algo va mal con el login de email', err.message);
        return err;
      })
  }

  createUser(user: any) {
    this.afs.collection('users').add(user).then((value => {
    })).catch((err => {
    }));
  }

  getUsers() {
    return this.usersCollection.valueChanges();
  }

  registerUser(perfil: Perfil) {
    return this.afAuth.auth.createUserWithEmailAndPassword("" + perfil.email, "" + perfil.password)
      .then(
        (user) => {
          var data = {
            displayName: perfil.displayName,
            email: perfil.email,
            photoURL: "../../assets/user-profile.png",
            uid: user.user.uid,
            role: "usuario"
          };
          user.user.updateProfile({
            displayName: perfil.displayName,
            photoURL: "../../assets/user-profile.png",
          });
          this.createUser(data);
        }
      ).catch(function (error) {
        console.log("Error ocurrido creando user con error:" + error);
        return error;
      })
  }

  getRole(uid: string) {
    return this.afs.collection<Usuario>('users', ref => ref.where('uid', '==', uid)).snapshotChanges();
  }


  getUserByUID(uid: string) {
    return this.afs.collection<Usuario>('users', ref => ref.where('uid', '==', uid)).valueChanges();
  }


  hacerAdmin(uid: string) {
    return this.afs.collection<Usuario>('users', ref => ref.where('uid', '==', uid)).get().toPromise().then(actions => {
      actions.forEach(a => {
        var id = a.id;      
        console.log(id);          
        console.log("dentro de primera map: " +a.id);
        var usuario = a.data() as Usuario;        
        usuario.role = "admin";
        console.table (usuario);
        this.afs.collection<Usuario>('users').doc(id).set(usuario);
      })
    })  
  }
}




/* this.getUserByUID(a.id).subscribe((asd) => {
          asd.forEach((cat: any) => {
            var user = cat.payload.doc.data() as Usuario
            console.table(user);
            let us : Usuario = {
              displayName : user.displayName,
              email : user.email,
              photoURL : user.photoURL,
              uid : user.uid,
              role : "admin"
            }
            this.afs.collection<Usuario>('users').doc(id).set(us);
          })
        })     */

