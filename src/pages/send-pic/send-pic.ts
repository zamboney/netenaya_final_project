import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireStorage } from 'angularfire2/storage';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { DetailsPage } from '../details/details';
import { ConfirmItemPage } from '../confirm-item/confirm-item';


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
  setAmount(data: any): number {
    const amountBlock = data.positions.filter((pos) => pos.words.filter((w) => w.word.match(/ש.*ל.*(מ|ם)/)).length);
    if (!amountBlock.length) {
      return;
    }
    const top_y = amountBlock[0].words.filter((w) => w.word.match(/ש.*ל.*(מ|ם)/))[0].boundingBox.vertices[0].y
    const bottom_y = amountBlock[0].words.filter((w) => w.word.match(/ש.*ל.*(מ|ם)/))[0].boundingBox.vertices[2].y
    let amount = data.positions.filter((w) => w.boundingBox.vertices[0].y + 10 >= top_y && w.boundingBox.vertices[0].y - 10 <= bottom_y).map((p) => parseFloat(p.description)).filter(Boolean);
    if (amount.length) {
      return amount[0];
    } else {
      return -1;
    }

  }
  setName(data: any) {
    return data.positions.filter((w) => w.boundingBox.vertices[0].y - 5 <= data.positions[0].boundingBox.vertices[2].y).reduce((a, b) => a += ' ' + b.description, '').trim()
  }
  setPayment(data: any) {
    const paymentBlock = data.positions.filter((pos) => pos.words.filter((w) => w.word.match(/(מזומן|אשראי)/)).length);
    if (paymentBlock.length) {
      return paymentBlock[0].description.match(/(מזומן|אשראי)/)[1];
    }
  }
  imageBase64: any;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: AngularFireStorage,
    public db: AngularFireDatabase,
    private spinnerDialog: SpinnerDialog,
    private uniqueDeviceID: UniqueDeviceID) {
    this.imageBase64 = 'data:image/jpeg;base64,' + navParams.data[0];

  }
  sendPicture() {
    let uuidRef;
    const id = Date.now() + '';
    this.uniqueDeviceID.get()
      .then((uuid: any) => {
        this.spinnerDialog.show();
        console.log(uuid)
        const listRef = this.db.list(uuid);
        let data = {
          id
        };
        const task = this.storage.upload(uuid + '/' + data.id + '.jpeg', this.dataURItoBlob(this.imageBase64));
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
        return uuid;
      })
      .then((uuid) => {
        const sub = this.db.list(uuid, ref => ref.orderByChild('id').equalTo(id))
          .valueChanges()
          .subscribe((item: any) => {
            if (item && item[0] && item[0].vision) {
              let positions = [];
              item[0].vision[0].fullTextAnnotation.pages[0].blocks.forEach((block) => {
                block.paragraphs.forEach((v) => {
                  v.words.forEach((item) => {
                    item.word = item.symbols.reduce((a, b) => a += b.text, '');
                  })
                  v.description = v.words.reverse().reduce((a, b) => {
                    b.symbols[0].text = ' ' + b.symbols[0].text; return b.symbols.concat(a)
                  }, []).reduce((a, b) => a += b.text, '');
                  v.width = ((v.boundingBox.vertices[2].x - v.boundingBox.vertices[0].x) / 7.2) + '%';
                  // v.height = ((533 / 960) * (v.boundingPoly.vertices[2].y - v.boundingPoly.vertices[0].y)) + 'px';
                  v.height = ((v.boundingBox.vertices[2].y - v.boundingBox.vertices[0].y) / 9.6) + '%';
                  // v.x = ((533 / 960) * v.boundingPoly.vertices[0].x) + 'px';
                  v.x = (v.boundingBox.vertices[0].x / 7.2) + '%';
                  // v.y = ((328 / 720) * v.boundingPoly.vertices[0].y) + 'px';
                  v.y = (v.boundingBox.vertices[0].y / 9.6) + '%';
                  positions.push(v);

                })
              })
              sub.unsubscribe();
              this.spinnerDialog.hide();
              let data: any = {
                id: item[0].id,
                downloadURL: item[0].downloadURL,
                positions: positions,

                // positions: item[0].vision.map((vv) => vv.textAnnotations.map((v) => {
                //   // v.width = ((328 / 720) * (v.boundingPoly.vertices[2].x - v.boundingPoly.vertices[0].x)) + 'px';
                //   v.width = ((v.boundingPoly.vertices[2].x - v.boundingPoly.vertices[0].x) / 7.2) + '%';
                //   // v.height = ((533 / 960) * (v.boundingPoly.vertices[2].y - v.boundingPoly.vertices[0].y)) + 'px';
                //   v.height = ((v.boundingPoly.vertices[2].y - v.boundingPoly.vertices[0].y) / 9.6) + '%';
                //   // v.x = ((533 / 960) * v.boundingPoly.vertices[0].x) + 'px';
                //   v.x = (v.boundingPoly.vertices[0].x / 7.2) + '%';
                //   // v.y = ((328 / 720) * v.boundingPoly.vertices[0].y) + 'px';
                //   v.y = (v.boundingPoly.vertices[0].y / 9.6) + '%';
                //   return v
                // }))[0]
              };
              data.name = this.setName(data);
              data.amount = this.setAmount(data);
              data.payment = this.setPayment(data);
              this.navCtrl.push(ConfirmItemPage, data);
            }

          })
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
