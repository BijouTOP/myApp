import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { HttpClientModule } from '@angular/common/http';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { HeaderComponent } from '../header/header.component';
import { ModalCommentComponent } from '../modal-comment/modal-comment.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    HttpClientModule,
    HeaderComponent,
    ModalCommentComponent
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
