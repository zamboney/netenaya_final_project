import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  items: any[];
  constructor(public navCtrl: NavController,
    public db: AngularFireDatabase,
    private uniqueDeviceID: UniqueDeviceID) {
    // this.uniqueDeviceID.get().then((uuid: any)=>{
    //   this.items = db.list(uuid).valueChanges();
    // })
    db.list('2b4fa2c3-6536-fcf7-3594-690718542978').valueChanges().subscribe((items) => {
      this.items = [];
      items.forEach((item: any, i: number) => {
        let data = {
          downloadURL: item.downloadURL,
          positions: item.vision.map((vv) => vv.textAnnotations.map((v) => {
            // v.width = ((328 / 720) * (v.boundingPoly.vertices[2].x - v.boundingPoly.vertices[0].x)) + 'px';
            v.width = ((v.boundingPoly.vertices[2].x - v.boundingPoly.vertices[0].x) / 7.2) + '%';
            // v.height = ((533 / 960) * (v.boundingPoly.vertices[2].y - v.boundingPoly.vertices[0].y)) + 'px';
            v.height = ((v.boundingPoly.vertices[2].y - v.boundingPoly.vertices[0].y) / 9.6) + '%';
            v.background = `#${i % 4}${i % 4}${i % 8}${i % 7}${i % 8}${i % 7}`
            // v.x = ((533 / 960) * v.boundingPoly.vertices[0].x) + 'px';
            v.x = (v.boundingPoly.vertices[0].x / 7.2) + '%';
            // v.y = ((328 / 720) * v.boundingPoly.vertices[0].y) + 'px';
            v.y = (v.boundingPoly.vertices[0].y / 9.6) + '%';
            return v
          }))[0]
        };
        data.positions.shift();
        this.items.push(data);
      })

    });
  }

}
