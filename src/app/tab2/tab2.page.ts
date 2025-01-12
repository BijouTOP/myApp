import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  myForm: FormGroup;
  url: string = 'https://mobile-api-one.vercel.app/api/travels';
  now: string;

  constructor(private fb: FormBuilder, private alertCtrl: AlertController, private http: HttpClient,
    private loadingController: LoadingController, private route: ActivatedRoute) {
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
    this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length > 0) {
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

    if (description == "") {
      const alert = await this.alertCtrl.create({
      header: 'Invalid Description',
      message: 'Please enter a description for your travel.',
      buttons: ['OK'],
      });
    
      await alert.present();
      return;
    }
    else if (type == "") {
      const alert = await this.alertCtrl.create({
      header: 'Invalid Type',
      message: 'Please select a type for your travel.',
      buttons: ['OK'],
      });
    
      await alert.present();
      return;
    }

    else if (state == "") {
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

      console.log(this.myForm.value);

      const loading = await this.loadingController.create({
        message: 'Please wait...'
      });
    
        await loading.present();
    
        this.http.post<any>(this.url, this.myForm.value, { headers: this.authHeader() }).subscribe({
          next: (response) => {
            loading.dismiss();
          },
          error: (error) => {
            console.error('Error:', error);
            loading.dismiss();
          }
      });
    } 
  }
}


