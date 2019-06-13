import { Component } from '@angular/core';
//import { SpeechRecognitionService } from './services/speech-recognition.service';

import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  //providers: [SpeechRecognitionService],
  templateUrl: './app.component.html',
  /*template: `
    <chat-config [(theme)]="theme"></chat-config>
    <chat-widget [theme]="theme"></chat-widget>
  `,*/
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '';
  email: string;
  password: string;
  public theme = 'blue';

  constructor(public _cs: AuthenticationService) {
  }

  loginEmail(){
    this._cs.loginEmail(this.email, this.password);
    this.email = this.password = '';    
  }


}
