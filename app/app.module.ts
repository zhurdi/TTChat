import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';

import { environment } from '../environments/environment';

//routing
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';

//componentes
import { ChatComponent } from './componentes/chat/chat.component';
import { LoginComponent } from './componentes/login/login.component';

//Material
import { MatButtonModule } from '@angular/material';
import { MatIconModule, MatToolbarModule, MatSidenavModule, MatListModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material'
import {
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatTabsModule,

} from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import { MatSelectModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material';
import { MatMenuModule} from '@angular/material/menu';



//servicios
import { ChatService } from './services/chat.service';
import { RoomService } from './services/room.service';

import { LayoutModule } from '@angular/cdk/layout';
import { RoomsComponent } from './componentes/rooms/rooms.component';

import { ElementModule } from '../element.module';
import { NavbarComponent } from './componentes/ui/navbar/navbar.component';
import { CardRegisterComponent } from './componentes/ui/card-register/card-register.component';

import { MatSnackBarModule } from '@angular/material';
import { FooterComponent } from './componentes/ui/footer/footer.component';
@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent,
    RoomsComponent,
    NavbarComponent,
    CardRegisterComponent,
    FooterComponent
  ],
  imports: [
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatCardModule,
    ElementModule,
    AngularFireDatabaseModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatIconModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'TTMChat'),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule, // imports firebase/storage only needed for storage features,
    FormsModule,
    MatButtonModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    NgbModule,
    NgxPageScrollCoreModule,
    MatMenuModule,
    MatSnackBarModule
  ],
  providers: [ChatService, RoomService],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
