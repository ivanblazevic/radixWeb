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

  radixUrl = "http://192.168.0.16:8080";
  items = [];
  info: Info = { title: null };
  mobileQuery = {
    matches: true
  }
  youTube: YouTube;

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
    this.sharedService.getInfo().subscribe(res => {
      this.info = res;
      if (!this.info.title) {
        this.info.title = "No title info";
      }
    });
    this.form.get("queryInput").valueChanges.pipe(debounce(() => timer(1000))).subscribe(
      (value: string) => {
        this.searchYoutube(value).subscribe(items => {
          this.ngZone.run(() => {
            this.items = items;
          });
        })
      }
    );
  }

  searchYoutube(query: string): Observable<any> {
    return new Observable(observer => {
      this.youTube.search(encodeURI(query), 50, function (error, result) {
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
    this.info.title = "In progress..."
    this.http.get(this.radixUrl + "/youtube?id=" + value.id.videoId, {}).subscribe(res => {
      console.log(res);
      this.info.title = value.snippet.title
    })
  }

}
