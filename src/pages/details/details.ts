import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList, DatabaseReference } from 'angularfire2/database';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;
  item: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public db: AngularFireDatabase,
    private uniqueDeviceID: UniqueDeviceID) {
    this.itemsRef = db.list('2b4fa2c3-6536-fcf7-3594-690718542978');
    // Use snapshotChanges().map() to store the key
    this.items = this.itemsRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
    this.item = navParams.data;
  }
  blockClick(block) {
    let profileModal = this.modalCtrl.create(EditBlock, block);
    profileModal.present();
    profileModal.onWillDismiss((data) => {
      if (data) {
        block.type = data.type
        let obj: any = {

        }
        switch (block.type) {
          case 'name':
            obj.name = data.value;
            break;
          case 'amount':
            obj.name = data.value;
            break;
          case 'payment':
            obj.name = data.value;
            break;
        }
        this.db.list('2b4fa2c3-6536-fcf7-3594-690718542978', ref => ref.orderByChild('id').equalTo(this.item.id)).snapshotChanges().subscribe((data)=>{
          this.db.list('2b4fa2c3-6536-fcf7-3594-690718542978').update(data[0].key,obj);
        });

      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailsPage');
  }

}

@Component({
  template: `
  <ion-header>
  <ion-toolbar>
    <ion-title>
      Description
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <span ion-text color="primary" showWhen="ios">Cancel</span>
        <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content>
<ion-list>
<ion-item>
<ion-label>type</ion-label>
<ion-select [(ngModel)]="type">
  <ion-option value="none">None</ion-option>
  <ion-option value="name">Name</ion-option>
  <ion-option value="amount">Amount</ion-option>
  <ion-option value="payment">Payment</ion-option>
</ion-select>
</ion-item>
<ion-item>
  <ion-label color="primary" stacked>Value</ion-label>
  <ion-input type="text" [(ngModel)]="value"></ion-input>
</ion-item>
</ion-list>
<button ion-button block (tap)='save()'>Save</button>
</ion-content>
  `,
  selector: 'edit-block'
})
export class EditBlock {
  type = 'none';
  value = '';
  dismiss() {
    this.viewCtrl.dismiss();
  }
  save() {
    this.viewCtrl.dismiss({
      type: this.type,
      value: this.value
    })
  }
  private block: any;
  constructor(params: NavParams,
    public viewCtrl: ViewController) {
    this.block = params.data;
    this.value = this.block.description
  }
}