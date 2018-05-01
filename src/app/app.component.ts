import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as YouTube from 'youtube-node';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  token = "c9ddafa9add4a6578cb542fa4e";

  serverHost = "https://radix-83cd.restdb.io/rest/stations";

  stations = [];

  searchText: string = "rock";
  items = [];

  constructor(private http: HttpClient) {

    let endpoint: string = "http://api.dirble.com/v2/search?query=" + this.searchText + "&token=" + this.token;

    http.post(endpoint, {}).subscribe(res => {
      console.log(res);
      // this.stations = res;
    })

    var self = this;
    var youTube = new YouTube();
    youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');
    youTube.search('metallica', 50, function(error, result) {
      if (error) {
        console.log(error);
      }
      else {
        console.log(result.items);
        self.items = result.items;
      }
    });

  }

}
