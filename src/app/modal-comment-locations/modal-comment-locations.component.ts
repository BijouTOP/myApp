import { Component, Input } from '@angular/core';
import { ModalController, LoadingController, ToastController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-modal-comment-locations',
  templateUrl: './modal-comment-locations.component.html',
  styleUrls: ['./modal-comment-locations.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule]
})
export class ModalCommentLocationsComponent  {
  @Input() location!: any;
  @Input() id!: string;

  locations: any[] = [];

  comments: any[] = [];
  comment: string = '';
  get_url: string = 'https://mobile-api-one.vercel.app/api/travels';
  url: string = 'https://mobile-api-one.vercel.app/api/travels/locations/comments';

  constructor(private modalController: ModalController, private http: HttpClient, private loadingController: LoadingController, private toastController: ToastController) { }

  ionViewWillEnter() {
    this.getComments();
  }

  authHeader() {

    const username = 'sousaguilherme@ipvc.pt';
    const password = '%2eV!Esu';

    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password)
    });
    return headers;
  }

  async getComments() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });

    await loading.present();

    this.http.get<any>(this.get_url, { headers: this.authHeader() }).subscribe({
      next: (response) => {
        for (let travel of response) {
          if (travel.id === this.id) {
            this.locations = travel.locations;
          }
        }
        for (let location of this.locations){
          if(location.id === this.location.id){
            this.location = location;
            this.comments = this.location.comments;
            console.log(this.location.comments);
            console.log(this.comments)
          }
        }
        loading.dismiss();
      },
      error: (error) => {
        loading.dismiss();
      }
    });
  }


  async deleteComment(id: string) {

    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });

    await loading.present();

    this.http.delete<any>(this.url + '/' + id, { headers: this.authHeader() }).subscribe({
      next: (response) => {
        this.getComments();
        loading.dismiss();
        this.presentToast('Comment deleted successfully');
      },
      error: (error) => {
        loading.dismiss();
        this.presentToast('Error deleting comment');
      }
    });


  }

  async submitComment() {
    if (this.comment === '') {
      this.presentToast('Comment cannot be empty');
      return;
    }
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
      await loading.present();
    this.http.post<any>(this.url, { comment: this.comment, locationId: this.location.id }, { headers: this.authHeader() }).subscribe({
      next: (response) => {
      this.getComments();
      loading.dismiss();
      this.comment = "";
      },
      error: (error) => {
      loading.dismiss();
      }
    });
  }
  dismiss() {
    this.modalController.dismiss();
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