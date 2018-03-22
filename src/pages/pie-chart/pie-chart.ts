import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import * as _ from 'lodash';
import { ItemsPage } from '../items/items';

/**
 * Generated class for the PieChartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-pie-chart',
  templateUrl: 'pie-chart.html',
})
export class PieChartPage {

  constructor(public db: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams) {
    this.db.list('2b4fa2c3-6536-fcf7-3594-690718542978').valueChanges().subscribe((data) => {
      this.doughnutChartLabels = [];
      this.doughnutChartLabels = _.uniq(data.map((data: any) => data.payment));
      this.doughnutChartData = [];

      this.doughnutChartLabels.forEach((payment) => {
        let a = data.filter((item: any) => item.payment === payment).reduce((a: any, b: any) => a += parseFloat(b.amount), 0);
        this.doughnutChartData.push(a);
      })
      let names = _.uniq(data.map((data: any) => data.name));
      this.payments = [];
      names.forEach((name) => {
        let amount = data.filter((item: any) => item.name === name).reduce((a: any, b: any) => a += parseFloat(b.amount), 0);
        this.payments.push({
          amount,
          items: data.filter((item: any) => item.name === name),
          name
        });
      })
      this.sum = this.doughnutChartData.reduce((a, b) => a += b);
    });
  }
  public details(items){
    this.navCtrl.push(ItemsPage,items);
  }
  public payments: any[] = [];
  public doughnutChartLabels: string[];
  public doughnutChartData: number[];
  public sum = 0;
  public doughnutChartType: string = 'doughnut';

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PieChartPage');
  }

}
