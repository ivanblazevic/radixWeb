import { Component, OnInit, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as YouTube from 'youtube-node';
import { Observable } from 'rxjs/Observable';
import { debounce } from 'rxjs/operators';
import { timer } from 'rxjs/observable/timer';
import { SharedService, Info } from './shared/shared.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  radixUrl = "https://192.168.0.16:8009";
  items = [];
  info: Info = { title: null };
  mobileQuery = {
    matches: true
  }
  youTube: YouTube;
  resultHeaderTitle: string;

  form = new FormGroup({
    queryInput: new FormControl()
  });

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private ngZone: NgZone
  ) {
    this.youTube = new YouTube();
    this.youTube.setKey('AIzaSyB1OOSpTREs85WUMvIgJvLTZKye4BVsoFU');
  }

  ngOnInit(): void {
    this.info.title = "Getting info..."

    const lastQuery = localStorage.getItem('query');
    if (lastQuery) {
      this.info.title = lastQuery;
      this.searchYoutube(this.info.title);
      this.form.get("queryInput").setValue(this.info.title);
    }

    this.sharedService.getInfo().subscribe(res => {
      this.info = res;
      if (!this.info.title) {
        this.info.title = "No title info";
      }
    });
    
    this.form.get("queryInput").valueChanges.pipe(debounce(() => timer(1000))).subscribe(
      (value: string) => {
        this.searchYoutube(value);
      }
    );
  }

  searchYoutube(query: string): void{
    this.resultHeaderTitle = "Searching...";

    const o = new Observable(observer => {
      this.youTube.search(query.replace(" ", "+"), 50, function (error, result) {
        if (error) {
          observer.error(error)
        } else {
          observer.next(result.items)
        }
        observer.complete();
      });
    })

    o.subscribe(items => {
      this.ngZone.run(() => {
        this.items = <any[]>items;
        this.items = this.items.filter(i => i.id.videoId); // filter only videos (not channels in results)
        localStorage.setItem('query', query);
        this.resultHeaderTitle = "Results:" + this.items.length;
      });
    })
  }

  play(value: any): void {
    this.info.title = "In progress..."
    this.http.get(this.radixUrl + "/youtube?id=" + value.id.videoId, {}).subscribe(res => {
      this.info.title = value.snippet.title
    }, err => alert)
  }

  repeat(): void {
    console.log("should repeat")
  }

}
