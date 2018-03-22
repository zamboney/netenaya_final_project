import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { ItemsPage } from '../items/items';
import { PieChartPage } from '../pie-chart/pie-chart';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = PieChartPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
