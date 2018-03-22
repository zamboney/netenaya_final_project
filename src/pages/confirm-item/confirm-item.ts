import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { ItemsPage } from '../items/items';

/**
 * Generated class for the ConfirmItemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-confirm-item',
  templateUrl: 'confirm-item.html',
})
export class ConfirmItemPage {
  item: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase, ) {
    this.item = navParams.data;
  }
  submit() {
    this.db.list('2b4fa2c3-6536-fcf7-3594-690718542978', ref => ref.orderByChild('id').equalTo(this.item.id)).snapshotChanges().subscribe((snap) => {
      this.db.list('2b4fa2c3-6536-fcf7-3594-690718542978').update(snap[0].key, {
        name: this.item.name,
        amount: this.item.amount,
        payment: this.item.payment
      });
      this.navCtrl.setPages([{page:ItemsPage}]);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmItemPage');
  }

}
