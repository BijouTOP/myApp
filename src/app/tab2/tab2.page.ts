import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../modal/modal.component';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  showAddLocationsButton: boolean = false;
  myForm: FormGroup;
  url: string = 'https://mobile-api-one.vercel.app/api/travels';
  now: string;
  variable: boolean = false;
  id!: string;
  buttonLabel: string = 'Submit';

  constructor(private fb: FormBuilder, private alertCtrl: AlertController, private http: HttpClient,
    private loadingController: LoadingController, private modalController: ModalController, private toastController: ToastController, private route: ActivatedRoute, private router: Router) {
    this.now = new Date().toISOString();

    this.myForm = this.fb.group({
      description: [''],
      type: [''],
      state: [''],
      startAt: [null],
      endAt: [null],
    });
  }

  ngOnInit() {
   
  }
  toogleButtonVisibility() {
    this.showAddLocationsButton = true;
    this.buttonLabel = 'Update';
  }
  untoogleButtonVisibility() {
    this.showAddLocationsButton = false;
    this.buttonLabel = 'Submit';
  }
  ionViewWillEnter() {
    this.resetForm();
    this.untoogleButtonVisibility();
    this.route.queryParams.subscribe(params => {
      console.log(params);
      if (Object.keys(params).length > 0) {
        this.toogleButtonVisibility();
        this.id = params['id'];
        this.variable = true;
        
        this.myForm.patchValue({
          description: params['description'] || '',
          type: params['type'] || '',
          state: params['state'] || '',
          startAt: params['startAt'] || null,
          endAt: params['endAt'] || null,
        });
      }
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


  async onSubmit() {
    let {description, type, state, startAt, endAt} = this.myForm.value;

    console.log(this.myForm.value);
    console.log("Anny are u ok?");
    console.log(this.myForm.value);

    if (description == "" || description == null) {
      const alert = await this.alertCtrl.create({
      header: 'Invalid Description',
      message: 'Please enter a description for your travel.',
      buttons: ['OK'],
      });
    
      await alert.present();
      return;
    }
    else if (type == "" || type == null) {
      const alert = await this.alertCtrl.create({
      header: 'Invalid Type',
      message: 'Please select a type for your travel.',
      buttons: ['OK'],
      });
    
      await alert.present();
      return;
    }

    else if (state == "" || state == null) {
      const alert = await this.alertCtrl.create({
      header: 'Invalid State',
      message: 'Please select a state for your travel.',
      buttons: ['OK'],
      });
    
      await alert.present();
      return;
    }

    else if (startAt > endAt) {
      const alert = await this.alertCtrl.create({
      header: 'Invalid Date',
      message: 'The start date must be before the end date.',
      buttons: ['OK'],
      });
    
      await alert.present();
      return;
    }

    else if (startAt < this.now && state == "upcoming") {
      const alert = await this.alertCtrl.create({
      header: 'Invalid Date',
      message: 'The start date must be in the future(Upcoming).',
      buttons: ['OK'],
      });
    
      await alert.present();
      return;
    }

    else if (endAt < this.now && state == "ongoing") {
      const alert = await this.alertCtrl.create({
      header: 'Invalid Date',
      message: 'The end date must be in the future(Ongoing).',
      buttons: ['OK'],
      });
    
      await alert.present();
      return;
    }

    else if (startAt > this.now && state == "ongoing") {
      const alert = await this.alertCtrl.create({
      header: 'Invalid Date',
      message: 'The start date must be in the past(Ongoing).',
      buttons: ['OK'],
      });
    
      await alert.present();
      return;
    }

    else if (endAt > this.now && state == "finished") {
      const alert = await this.alertCtrl.create({
      header: 'Invalid Date',
      message: 'The end date must be in the past(Finished).',
      buttons: ['OK'],
      });
    
      await alert.present();
      return;
    }

    else {
      if (endAt == null) {
        endAt = this.now;
        this.myForm.patchValue({ endAt: endAt });
      }
      if (startAt == null) {
        startAt = this.now;
        this.myForm.patchValue({ startAt: startAt });
      }

      const loading = await this.loadingController.create({
        message: 'Please wait...'
      });
    
        await loading.present();
      if (this.variable) {
        this.http.put<any>(this.url + '/' + this.id, this.myForm.value, { headers: this.authHeader() }).subscribe({
          next: (response) => {
            this.myForm.reset();
            this.variable = false;
            this.router.navigate([], { queryParams: {} });
            loading.dismiss();
            this.untoogleButtonVisibility();
            this.presentToast('Travel updated successfully');
          },
          error: (error) => {
            console.error('Error:', error);
            loading.dismiss();
            this.presentToast('Error updating travel');
          }
        });
      }
      else {
        this.http.post<any>(this.url, this.myForm.value, { headers: this.authHeader() }).subscribe({
          next: (response) => {
            loading.dismiss();
            this.myForm.reset();
            this.presentToast('Travel added successfully');
          },
          error: (error) => {
            console.error('Error:', error);
            loading.dismiss();
            this.presentToast('Error adding travel');
          }
      });
    } 
    }
  }
  resetForm() {
    this.myForm.reset();
    this.variable = false;
    this.router.navigate([], { queryParams: {} });
    this.untoogleButtonVisibility();
  }
  async addLocations() {
    
      const modal = await this.modalController.create({
        component: ModalComponent, 

      });
      await modal.present();
      const { data } = await modal.onDidDismiss();
      if (data.prop1 === "" || data.description === "") {
        const alert = await this.alertCtrl.create({
          header: 'Invalid Location',
          message: 'Please enter a location name and description.',
          buttons: ['OK'],
          });
        
          await alert.present();
          return;
      }
      const loading = await this.loadingController.create({
        message: 'Please wait...'
      });
    
        await loading.present();
      if (data) {
        data.travelId = this.id;
        this.http.post<any>(this.url + '/locations', data, { headers: this.authHeader() }).subscribe({
          next: (response) => {
            this.presentToast('Location added successfully');
            loading.dismiss();
          },
          error: (error) => {
            this.presentToast('Error adding location');
            loading.dismiss();
        }
      });
    }
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


