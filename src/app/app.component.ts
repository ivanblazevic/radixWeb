import { Component, OnInit, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as YouTube from 'youtube-node';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  radixUrl = "http://192.168.0.16:8080";
  token = "c9ddafa9add4a6578cb542fa4e";
  serverHost = "https://radix-83cd.restdb.io/rest/stations";
  stations = [];
  searchText: string = "rock";
  items = [];
  info: any;
  mobileQuery = {
    matches: true
  }
  youTube: YouTube;

  constructor(
    private http: HttpClient,
    private ngZone: NgZone
  ) {
    let endpoint: string = "http://api.dirble.com/v2/search?query=" + this.searchText + "&token=" + this.token;
    /*
    http.post(endpoint, {}).subscribe(res => {
      console.log(res);
      // this.stations = res;
    })
    */
    var self = this;
    this.youTube = new YouTube();
    this.youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');
  }

  ngOnInit(): void {
    this.searchYoutube("metallica").subscribe(items => {
      this.ngZone.run(() => {
        this.items = items;
      });
    });
  }

  searchYoutube(query: string): Observable<any> {
    return new Observable(observer => {
      this.youTube.search('metallica', 50, function(error, result) {
        if (error) {
          observer.error(error)
        } else {
          observer.next(result.items)
        }
        observer.complete();
      });
    })
  }

  play(value: any) {
    this.info = {
      title: value.snippet.title
    }
    this.http.get(this.radixUrl + "/youtube?id=" + value.id.videoId, {}).subscribe(res => {
      console.log(res);
    })
  }

}
