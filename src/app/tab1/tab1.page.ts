import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ModalCommentComponent } from '../modal-comment/modal-comment.component';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone:false,
})
export class Tab1Page {
  travels: any[] = [];
  filteredTravels: any[] = [];
  url: string = 'https://mobile-api-one.vercel.app/api/travels';

  constructor(private http: HttpClient,
    private loadingController: LoadingController, private router: Router, private toastController: ToastController, private modalController: ModalController
  ) {}

  editTravel(travel: any) {
    this.router.navigate(['/tabs/tab2'], {
      queryParams: {
        description: travel.description,
        type: travel.type,
        state: travel.state,
        startAt: travel.startAt,
        endAt: travel.endAt,
        id: travel.id
      },
    });
  }

  filterTravels(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm === '') {
      this.filteredTravels = this.travels;
      return;
    }
    else if (searchTerm === 'fav' || searchTerm === 'favorite' ) {
      this.filteredTravels = this.travels.filter(travel => travel.isFav);
      return;
    }
    else if (searchTerm === 'upcoming') {
      this.filteredTravels = this.travels.filter(travel => travel.state === 'upcoming');
      return;
    }
    else if (searchTerm === 'ongoing') {
      this.filteredTravels = this.travels.filter(travel => travel.state === 'ongoing');
      return;
    }
    else if (searchTerm === 'completed') {
      this.filteredTravels = this.travels.filter(travel => travel.state === 'completed');
      return;
    }
    else if (searchTerm === 'business') {
      this.filteredTravels = this.travels.filter(travel => travel.type === 'business');
      return;
    }
    else if (searchTerm === 'leisure') {
      this.filteredTravels = this.travels.filter(travel => travel.type === 'leisure');
      return;
    }
    else if (searchTerm === 'other') {
      this.filteredTravels = this.travels.filter(travel => travel.type === 'other');
      return;
    }
    else {this.filteredTravels = this.travels.filter(travel => {
      return travel.description.toLowerCase().includes(searchTerm) ||
             travel.type.toLowerCase().includes(searchTerm) ||
             travel.state.toLowerCase().includes(searchTerm) ||
             travel.locations.some((location: { prop1: string; description: string; }) => location.prop1.toLowerCase().includes(searchTerm) || location.description.toLowerCase().includes(searchTerm));
    });}

    
  }


  ngOnInit() {
    this.tab1Get();
  }

  ionViewWillEnter() {
    this.tab1Get();
  }

  authHeader() {

    const username = 'sousaguilherme@ipvc.pt';
    const password = '%2eV!Esu';

    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password)
    });
    return headers;
  }

  async tab1Get() {

    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });

    await loading.present();

    this.http.get<any[]>(this.url, { headers: this.authHeader() }).subscribe({
      next: (response) => {
        this.travels = response;
        this.filteredTravels = response;
        loading.dismiss();
      },
      error: (error) => {
        loading.dismiss();
      }
    });
  }

  async deleteFromList(id: string) {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });

    await loading.present();

    this.http.delete<any>(this.url + '/' + id, { headers: this.authHeader() }).subscribe({
      next: (response) => {
        this.tab1Get();
        loading.dismiss();
        this.presentToast('Travel deleted successfully');
      },
      error: (error) => {
        loading.dismiss();
        this.presentToast('Error deleting travel');
      }
    });
  }

  async toogleFav(travel: any) {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });

    await loading.present();

    travel.isFav = !travel.isFav;
    this.http.put<any>(this.url + '/' + travel.id, travel, { headers: this.authHeader() }).subscribe({

      next: (response) => {
        this.tab1Get();
        loading.dismiss();
        this.presentToast('Travel updated successfully');
      },
      error: (error) => {     
        loading.dismiss();
        this.presentToast('Error updating travel');
      }
    });
  }
  async travelComments(id: string) {
    const modal = await this.modalController.create({
      component: ModalCommentComponent,
      componentProps: { travelId: id }
    });
    await modal.present();
  }
  showLocations(id: string) {
    this.router.navigate(['/tabs/tab3'], {
      queryParams: {
        id: id
      },
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