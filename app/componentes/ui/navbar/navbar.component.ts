import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService } from "../../../services/authentication.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  email: string;
  password: string;
  nombre: string;
  emailRegistro: string;
  passwordRegistro: string;
  public closeResult: string;
  userForm: FormGroup;
  mensaje_error: string;
  @Input() usuario: any;
  state: string = '';
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeBtn2') closeBtn2: ElementRef;
  @ViewChild('closeBtn3') closeBtn3: ElementRef;
  error: any;
  errorRegistro: string;
  role3: string;
  email3: string;
  nombre3: string;


  constructor(private _snackBar: MatSnackBar, public _router: Router, public _as: AuthenticationService, private fb: FormBuilder, public afAuth: AngularFireAuth, private afs: AngularFirestore) { 

    
  }

  ngOnInit() {
    this.buildForm();
    this._as.usuario.subscribe(
      user => {
        if (!user) {
          return;
        } this.usuario = user;
      })
  } 


  loginEmail(formData) {
    if (formData.valid) {
      this.error = "";
      this.email = formData.value.email;
      this.password = formData.value.password;
      this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password).then(
        (success) => {
          this.openSnackBarBottom("Logueado correctamente",'');
          this.closeBtn.nativeElement.click();
        }).catch(
          (err) => {          
            this.error = "Usuario o pass incorrecto";
            setTimeout(() => {
              this.error = "";
            }, 3500)

          })
    }
    this.email = this.password = '';
  }


  registerUser(formData2) {
    if (formData2.valid) {
      this.error = "";      
      this.nombre = formData2.value.nombre;
      this.emailRegistro = formData2.value.email;
      this.passwordRegistro = formData2.value.password;
      this._as.afAuth.auth.createUserWithEmailAndPassword("" + this.emailRegistro, "" + this.passwordRegistro)
        .then(
          (user) => {            
            var data = {
              displayName: this.nombre,
              email: this.emailRegistro,
              photoURL: "../../assets/user-profile.png",
              uid: user.user.uid,
              role: "usuario"
            };                               
            this._as.createUser(data);                      
            user.user.updateProfile({
              displayName: this.nombre,
              photoURL: "../../assets/user-profile.png",
            });                         
            this._as.role = data.role;      
            this._as.usuario = null;
            this.openSnackBarTop("Registrándose en el sistema y logueándose...",'');
            this.closeBtn2.nativeElement.click(); 
            this.refrescarPagina();           
          }
        ).catch((err) => {
          if (err == "Error: The email address is already in use by another account.") {
            this.error = "El usuario ya existe en el sistema."; 
            setTimeout(() => {
            }, 3500)
          }
        })                               
    } 
  }

  refrescarPagina(){
    setTimeout(() => {      
      location.reload();    
      this.error="";
    }, 2250)
  }


  buildForm(): void {
    this.userForm = this.fb.group({
      'email': ['', [
        Validators.required,
        Validators.email],
      ],
      'password': ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(25)
      ],
      ],
      'nombre': ['', [
        Validators.required,
        Validators.minLength(2)
      ],]
    });

    this.userForm.valueChanges.subscribe(data => {
      this.onValueChanged(data)
    });
    this.onValueChanged();
  }



  onValueChanged(data?: any) {
    if (!this.userForm) { return; }
    const form = this.userForm;
    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + '';
        }
      }
    }
  }

  formErrors = {
    'email': '',
    'password': '',
    'nombre': ''
  };

  validationMessages = {
    'email': {
      'required': 'Email es obligatorio',
      'email': 'Email no válido',
    },
    'password': {
      'required': 'Password es necesaria.',
      'pattern': 'Password debe incluir una letra y numero',
      'minlength': 'Password debe tener 6 caracteres mínimo',
      'maxlength': 'Password no puede superar los 40 caracters',
    },
    'nombre': {
      'required': 'Nombre es obligatorio',
      'minlength': 'Debe introducir un nombre'
    }
  };

  private S4(): string {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }
  isLoginTaken(): boolean {
    return this.userForm.get('login').hasError('loginExist');
  }


  openSnackBarBottom(message: string, action: string) {
    this._snackBar.open(message, action, {
        duration: 1300,
        horizontalPosition: 'center',
        verticalPosition: 'bottom', 
      })
 }   

 
 openSnackBarTop(message: string, action: string){
  this._snackBar.open(message, action, {
    duration: 1500,
    horizontalPosition: 'center',
    verticalPosition: 'top', 
  })
 }

  actualizarUsuario(nombre, email) {
    let editSubscribe = this._as.actualizarPerfilUsuario(nombre,email).subscribe(a=>{
      editSubscribe.unsubscribe();
    });
    this.openSnackBarBottom("Datos actualizados",'');   
    this.closeBtn3.nativeElement.click();
  }

}

