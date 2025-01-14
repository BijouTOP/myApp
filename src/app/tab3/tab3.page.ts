import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';

import { ModalCommentLocationsComponent } from '../modal-comment-locations/modal-comment-locations.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  locations: any[] = [];
  filteredLocations: any[] = [];
  id!: string;
  url: string = 'https://mobile-api-one.vercel.app/api/travels';

  constructor(private http: HttpClient,private modalController: ModalController, private loadingController: LoadingController, private toastController: ToastController, private activatedRoute: ActivatedRoute, private route: ActivatedRoute) {

  }
  filterLocations(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm === '') {
      this.filteredLocations = this.locations;
      return;
    }
    this.filteredLocations = this.locations.filter(location => location.description.toLowerCase().includes(searchTerm));
  }

  ionViewWillEnter() {
    this.getLocations();
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });
  }
  
  authHeader() {

    const username = 'sousaguilherme@ipvc.pt';
    const password = '%2eV!Esu';

    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password)
    });
    return headers;
  }
  async getLocations() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });

    await loading.present();

    this.http.get<any>(this.url + '/' + this.id + '/locations', { headers: this.authHeader() }).subscribe({
      
      next: (response) => {
        this.locations = response;
        this.filteredLocations = response;
        loading.dismiss();
        
      },
      error: (error) => {
        loading.dismiss();
        this.presentToast('Error loading locations');
      }
    });

  }


  async viewComments(location: any) {
   
    const modal = await this.modalController.create({
    component: ModalCommentLocationsComponent,
    componentProps: { location: location , id: this.id}
    });
       await modal.present();
     
  }
  async deleteLocation(id: string)
  {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });

    await loading.present();

    this.http.delete<any>(this.url + '/' + 'locations/' + id, { headers: this.authHeader() }).subscribe({
      next: (response) => {
        this.getLocations();
        loading.dismiss();
        this.presentToast('Location deleted');
      },
      error: (error) => {
        loading.dismiss();
        this.presentToast('Error deleting location');
      }
    });
  }
  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}
