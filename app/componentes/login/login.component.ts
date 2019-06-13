import { Component, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { AuthenticationService } from "../../services/authentication.service";
import { Perfil } from '../../interface/perfil';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: ['./login.component.css']
})

export class LoginComponent {

  public email: string;
  public password: string;
  public nombre: string;
  public closeResult: string;

  
  constructor(public _as: AuthenticationService, private modalService: NgbModal, private _route: ActivatedRoute, private _location: Location, private _router: Router) {
  }

  loginEmail() {
    this._as.loginEmail(this.email, this.password);
    this.email = this.password = '';
  }

  onBack() {
    this._location.back();
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Cerrado con resultado: ${result}`;
    }, (reason) => {
      this.closeResult = `Reset `;
    });
  }

  close() {
    try { this.modalService.dismissAll(); 
    } catch (error) {
      console.log(error);
    }
  }

  registerUser(email: string, password: string, nombre: string) {
    var uid = `${this.S4()}${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}-${this.S4()}${this.S4()}${this.S4()}`;
    let perfil: Perfil = {
      uid,
      photoURL: "../../../assets/user-profile.png",
      email: email,
      password: password,
      displayName: nombre,
    }
    this._as.registerUser(perfil);    
  }


  private S4(): string {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

}
