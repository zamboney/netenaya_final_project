import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireStorage } from 'angularfire2/storage';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';


/**
 * Generated class for the SendPicPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-send-pic',
  templateUrl: 'send-pic.html',
})
export class SendPicPage {
  imageBase64: any;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: AngularFireStorage,
    public db: AngularFireDatabase,
    private uniqueDeviceID: UniqueDeviceID) {
    this.imageBase64 = 'data:image/jpeg;base64,' + navParams.data[0];

  }
  sendPicture() {

    this.uniqueDeviceID.get()
      .then((uuid: any) => {
        console.log(uuid)
        const listRef = this.db.list(uuid);
        let data = {
          id: `${Date.now()}.jpeg`
        };
        const task = this.storage.upload(uuid + '/' + data.id, this.dataURItoBlob(this.imageBase64));
        // observe percentage changes
        this.uploadPercent = task.percentageChanges();
        // get notified when the download URL is available
        let dataRef = listRef.push(data);
        this.downloadURL = task.downloadURL();
        this.downloadURL.subscribe((url) => {
          listRef.update(dataRef, {
            downloadURL: url
          })
        })
        return task;
      })
      .then((task) => {

      })
      .catch((error: any) => console.log(error));

  }
  dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var bb = new Blob([ab]);
    return bb;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SendPicPage');
  }

}
