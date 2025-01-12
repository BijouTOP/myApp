import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone:false,
})
export class Tab1Page {
  travels: any[] = [];
  url: string = 'https://mobile-api-one.vercel.app/api/travels';

  constructor(private http: HttpClient,
    private loadingController: LoadingController, private router: Router
  ) {}

  editTravel(travel: any) {
    this.router.navigate(['/tabs/tab2'], {
      queryParams: {
        description: travel.description,
        type: travel.type,
        state: travel.state,
        startAt: travel.startAt,
        endAt: travel.endAt,
      },
    });
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
        console.log(response);
        loading.dismiss();
      },
      error: (error) => {
        console.error('Error:', error);
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
      },
      error: (error) => {
        console.error('Error:', error);
        loading.dismiss();
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
      },
      error: (error) => {     
        console.error('Error:', error);
        loading.dismiss();
      }
    });
  }
}