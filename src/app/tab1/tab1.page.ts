import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  constructor(private http: HttpClient) {}

  sendRequest() {
    const url = 'https://jsonplaceholder.typicode.com/posts';

    this.http.get(url).subscribe((response) => {
      console.log(response);
    });

}}