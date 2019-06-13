import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

@Injectable()
export class SpeechRecognitionService {

  public grabando: boolean = false;
  speechRecognition: any;

  constructor(private zone: NgZone) {
  }

  record(language: string): Observable<string> {
    return Observable.create(observer => {
      const { webkitSpeechRecognition }: IWindow = <IWindow>window;
      this.speechRecognition = new webkitSpeechRecognition();
      this.speechRecognition.continuous = true;
      this.speechRecognition.interimResults = true;

      //ya lo podemos renderizar en la vista
      this.speechRecognition.onresult = e => this.zone.run(() => observer.next(e.results.item(e.results.length - 1).item(0).transcript));
      this.speechRecognition.onerror = e => observer.error(e);
      this.speechRecognition.onend = () => observer.complete();
      this.speechRecognition.lang = language;
      this.speechRecognition.start();      
      this.grabando = true;
      console.log("grabando: " + this.grabando);
    });

  }

  stop(): void {
    if (this.speechRecognition) {
      this.speechRecognition.stop();
      this.grabando = false;
      console.log("paro de grabar y valor grabando: " + this.speechRecognition.valor);
    } else {
      console.log("no he parado de grabar");
    }
  }

  isGrabando(): boolean {
    return this.grabando;
  }

}
