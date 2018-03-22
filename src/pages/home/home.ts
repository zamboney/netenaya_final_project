import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';
import { SendPicPage } from '../send-pic/send-pic';
const cameraPreviewOpts: CameraPreviewOptions = {
  x: 0,
  y: 56,
  width: window.screen.width,
  height: window.screen.height - 168,
  camera: 'rear',
  toBack: true,
  tapPhoto: true
};
const pictureOpts: CameraPreviewPictureOptions = {
  width: 1280,
  height: 1280,
  quality: 85
}
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public getWidth: number;
  public getHeight: number;
  public calcWidth: number;
  private picture: any;
  items: Observable<any[]>;
  constructor(
    public db: AngularFireDatabase,
    public navCtrl: NavController,
    public zone: NgZone,
    private cameraPreview: CameraPreview
  ) {
    this.zone.run(() => {
      this.getWidth = window.innerWidth;

      this.getHeight = window.innerHeight;
    });
    console.log('width', this.getWidth);
    
    // this.startCamera();
    
  }
  startCamera() {
    this.cameraPreview.startCamera(cameraPreviewOpts).then(
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
      });
    // Set the handler to run every time we take a picture
    
  }
  ionViewDidLoad() {
    this.startCamera();
  }
  takePicture() {
    this.cameraPreview.takePicture(pictureOpts).then((imageData) => {
      this.navCtrl.push(SendPicPage,imageData)
      this.cameraPreview.stopCamera();
    }, (err) => {
      console.log(err);
    });
  }

}
