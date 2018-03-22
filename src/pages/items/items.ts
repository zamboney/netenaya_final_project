import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { DetailsPage } from '../details/details';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the ItemsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-items',
  templateUrl: 'items.html',
})
export class ItemsPage {

  items: Observable<any[]>;;
  edit(item: any) {
    this.navCtrl.push(DetailsPage, item);
  }
  constructor(public navCtrl: NavController,
    public db: AngularFireDatabase,
    public navParams: NavParams,
    private uniqueDeviceID: UniqueDeviceID) {
    // this.uniqueDeviceID.get().then((uuid: any)=>{
    //   this.items = db.list(uuid).valueChanges();
    // })

    this.items = navParams.data;

    // .subscribe((items) => {
    //   this.items = [];
    //   items.filter((item: any) => !!item.vision).forEach((item: any, i: number) => {
    //     let data = {
    //       name: item.name,
    //       id: item.id,
    //       downloadURL: item.downloadURL,
    //       positions: item.vision.map((vv) => vv.textAnnotations.map((v) => {
    //         // v.width = ((328 / 720) * (v.boundingPoly.vertices[2].x - v.boundingPoly.vertices[0].x)) + 'px';
    //         v.width = ((v.boundingPoly.vertices[2].x - v.boundingPoly.vertices[0].x) / 7.2) + '%';
    //         // v.height = ((533 / 960) * (v.boundingPoly.vertices[2].y - v.boundingPoly.vertices[0].y)) + 'px';
    //         v.height = ((v.boundingPoly.vertices[2].y - v.boundingPoly.vertices[0].y) / 9.6) + '%';
    //         v.background = `#${i % 4}${i % 4}${i % 8}${i % 7}${i % 8}${i % 7}`
    //         // v.x = ((533 / 960) * v.boundingPoly.vertices[0].x) + 'px';
    //         v.x = (v.boundingPoly.vertices[0].x / 7.2) + '%';
    //         // v.y = ((328 / 720) * v.boundingPoly.vertices[0].y) + 'px';
    //         v.y = (v.boundingPoly.vertices[0].y / 9.6) + '%';
    //         return v
    //       }))[0]
    //     };
    //   data.positions.shift();
    //   this.items.push(data);
    // })

    // });
  }
  details(item) {
    this.navCtrl.push(DetailsPage, item);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemsPage');
  }

}
