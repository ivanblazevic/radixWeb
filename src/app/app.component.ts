import { Component, OnInit, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as YouTube from 'youtube-node';
import { Observable } from 'rxjs/Observable';
import { debounce } from 'rxjs/operators';
import { timer } from 'rxjs/observable/timer';
import { SharedService, Info } from './shared/shared.service';
import { FormControl, FormGroup } from '@angular/forms';

import * as compareVersions from "compare-versions";

enum Plugin {
  Stations,
  YouTube,
  GoogleMusic
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  radixUrl = "https://radix.local:8009";
  items = [];
  info: Info = { title: null, volume: 0, version: "" };
  showSettings: boolean = true;
  mobileQuery = {
    matches: true
  }
  youTube: YouTube;
  resultHeaderTitle: string;
  plugin: Plugin;
  Plugin = Plugin;

  updateAvailable: boolean = false;
  newVersion;

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
    this.info.title = "Getting info...";
    this.plugin = localStorage.getItem("plugin") ? parseInt(localStorage.getItem("plugin")) : Plugin.YouTube;

    const lastQuery = localStorage.getItem('query');
    if (lastQuery) {
      this.form.get("queryInput").setValue(lastQuery);
    }

    this.sharedService.getInfo().subscribe(res => {
      this.info = res;
      if (!this.info.title) {
        this.info.title = "No title info";
      }
      this.checkNewVersion(this.info.version);
      console.log(res);
    });
    
    this.form.get("queryInput").valueChanges.pipe(debounce(() => timer(1000))).subscribe(
      (value: string) => {
        if (this.plugin == Plugin.YouTube) {
          this.searchYoutube(value);
        }
      }
    );

    this.init(this.plugin);
  }

  init(plugin: Plugin): void {
    this.plugin = plugin;
    localStorage.setItem("plugin", plugin.toString());
    this.items = [];
    switch(plugin) {
      case Plugin.Stations: {
        this.resultHeaderTitle = "Getting favorites...";
        this.sharedService.getFavorites().subscribe(res => {
          this.items = res;
        });
        break;
      }
      case Plugin.YouTube: {
        this.resultHeaderTitle = "Searching...";
        this.searchYoutube(this.form.get("queryInput").value);
        break;
      }
    }
  }

  isYouTube(): boolean {
    return this.plugin == Plugin.YouTube;
  }

  isRadio(): boolean {
    return this.plugin == Plugin.Stations;
  }

  isGoogleMusic(): boolean {
    return this.plugin == Plugin.GoogleMusic;
  }

  searchYoutube(query: string): void{
    if (!query) {
      this.resultHeaderTitle = "Type something...";
      return;
    }

    this.resultHeaderTitle = "Searching...";

    const o = Observable.create(observer => {
      this.youTube.search(query.replace(" ", "+"), 50, function (error, result) {
        if (error) {
          observer.error(error)
        } else {
          observer.next(result.items)
        }
        observer.complete();
      });
    })

    var u = o.subscribe(items => {
      this.ngZone.run(() => {
        this.items = <any[]>items;
        this.items = this.items.filter(i => i.id.videoId); // filter only videos (not channels in results)
        localStorage.setItem('query', query);
        u.unsubscribe();
      });
    })

  }

  play(value: any): void {
    this.items.forEach(i => i.isActive = false); // reset all active
    value.isActive = true;
    this.info.title = "In progress..."

    if (this.isYouTube()) {
      this.http.get(this.radixUrl + "/youtube?id=" + value.id.videoId).subscribe(res => {
        this.info.title = value.snippet.title
      }, err => {
        alert(JSON.stringify(err));
      })
    }

    if (this.isRadio()) {
      this.http.get(this.radixUrl + "/play?url=" + value.url + "&title=" + value.title).subscribe(res => {
        this.info.title = value.title
      }, err => {
        alert(JSON.stringify(err));
      })
    }

  }

  repeat(): void {
    console.log("should repeat")
  }

  onVolume(): void {
    this.sharedService.volume(this.info.volume).subscribe(res => {
      console.log(res);
    }, err => {
      alert(JSON.stringify(err));
    })
  }

  onUpdate(): void {
    this.sharedService.update().subscribe(res => {
      console.log(res);
    }, err => {
      alert(JSON.stringify(err));
    })
  }

  saveConfig(): void {
    this.sharedService.saveConfig({ 
      googleUsername: this.info.googleUsername,
      googlePassword: this.info.googlePassword 
    }).subscribe(res => {
      console.log(res);
    }, err => {
      alert(JSON.stringify(err));
    })
  }

  private checkNewVersion(currentVersion: string): void {
    this.http.get("https://api.github.com/repos/ivanblazevic/radix/releases/latest").subscribe(res => {
      this.newVersion = res["tag_name"];
      this.updateAvailable = compareVersions(this.newVersion, currentVersion);
    })
  }

}
