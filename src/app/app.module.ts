import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from '../environment';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { CameraPreview } from '@ionic-native/camera-preview';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { SendPicPage } from '../pages/send-pic/send-pic';
import { ItemsPage } from '../pages/items/items';
import { DetailsPage, EditBlock } from '../pages/details/details';
@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    SendPicPage,
    ItemsPage,
    DetailsPage,
    EditBlock
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig), // imports firebase/app needed for everything
    AngularFireDatabaseModule, // imports firebase/database, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFireStorageModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    SendPicPage,
    ItemsPage,
    DetailsPage,
    EditBlock
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CameraPreview,
    UniqueDeviceID,
    SpinnerDialog,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
