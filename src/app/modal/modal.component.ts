import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule]
})
export class ModalComponent  {
  prop1: string = ''; 
  description: string = ''; 
  
  constructor(private modalController: ModalController) {}
  dismiss() {
    this.modalController.dismiss();
  }
  save() {
    const userInput = {
      prop1: this.prop1,
      description: this.description,
    };
  
    this.modalController.dismiss(userInput);
    
  }
}
  

