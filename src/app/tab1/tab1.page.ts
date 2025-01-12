import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss'],
  standalone : false,
})
export class Tab1Page {
  items: any[] = [];

  constructor(private http: HttpClient,
    private loadingController: LoadingController
  ) {}

  async sendRequest() {
    const url = 'https://mobile-api-one.vercel.app/api/travels';

    const username = 'sousaguilherme@ipvc.pt';
    const password = '%2eV!Esu';

    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password)
    });

    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });

    await loading.present();

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (response) => {
        this.items = response;
        console.log(response);
        loading.dismiss();
      },
      error: (error) => {
        console.error('Error:', error);
        loading.dismiss();
      }
    });
  }
}