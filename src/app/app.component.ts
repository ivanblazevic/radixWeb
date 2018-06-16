import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as YouTube from 'youtube-node';
import { Observable } from 'rxjs/Observable';
import { debounce } from 'rxjs/operators';
import { timer } from 'rxjs/observable/timer';
import { SharedService, Info } from './shared/shared.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material';

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

  version = "0.12";
  radixUrl = "";
  items = [];
  info: Info = { title: null, volume: 0, version: "" };
  showSettings: boolean = false;
  mobileQuery = {
    matches: true
  }
  youTube: YouTube;
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
    private ngZone: NgZone,
    public snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.radixUrl = this.sharedService.host;
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
    }, err => {
      this.snackBar.open(err.message, "Close");
    });
    
    this.form.get("queryInput").valueChanges.pipe(debounce(() => timer(1000))).subscribe(
      (value: string) => {
        if (this.plugin == Plugin.YouTube) {
          this.searchYoutube(value);
        }
        if (this.plugin == Plugin.Stations) {
          this.searchStations(value);
        }
        if (this.plugin == Plugin.GoogleMusic) {
          this.searchGoogleMusic(value);
        }
      }
    );

    this.init(this.plugin);
  }

  init(plugin: Plugin): void {
    this.showSettings = false
    this.plugin = plugin;
    localStorage.setItem("plugin", plugin.toString());
    this.items = [];
    switch(plugin) {
      case Plugin.Stations: {
        this.sharedService.getFavorites().subscribe(res => {
          this.items = res;
        });
        break;
      }
      case Plugin.YouTube: {
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

  showCustom() {
    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: { title: "", url: "" }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.play(result);
    });
  }

  searchYoutube(query: string): void {
    if (!query) {
      return;
    }

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

  searchStations(query: string): void {
    if (!query) {
      return;
    }
    this.sharedService.searchStations(query).subscribe(res => {
      this.items = <any[]>res;
    })
  }

  searchGoogleMusic(query: string): void {
    if (!query) {
      return;
    }
    this.sharedService.searchGoogleMusic(query.replace(" ", "+")).subscribe(res => {
      this.items = <any[]>res;
    })
  }

  play(value: any): void {
    this.items.forEach(i => i.isActive = false); // reset all active
    value.isActive = true;
    if (value._id) {
      this.info.id = value._id;
    }
    this.info.title = "In progress..."

    if (this.isYouTube()) {
      this.http.get(this.radixUrl + "/youtube?id=" + value.id.videoId).subscribe(res => {
        this.info.title = value.snippet.title
      }, err => {
        this.snackBar.open(err.message, "Close");
      })
    }

    if (this.isRadio()) {
      this.http.get(this.radixUrl + "/play?url=" + value.url + "&title=" + value.title).subscribe(res => {
        this.info.title = value.title
      }, err => {
        this.snackBar.open(JSON.stringify(err.message));
      })
    }

    if (this.isGoogleMusic()) {
      this.http.get(this.radixUrl + "/gplay?id=" + value.id).subscribe(res => {
        this.info.title = value.artist + " - " +  value.title
      }, err => {
        this.snackBar.open(err.message, "Close");
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
      this.snackBar.open(err.message, "Close");
    })
  }

  increaseVolumeBy(percentage: number): void {
    this.sharedService.volumeByPercentage(percentage).subscribe(res => {
      console.log(res);
    }, err => {
      this.snackBar.open(err.message, "Close");
    })
  }

  onUpdate(): void {
    this.sharedService.update().subscribe(res => {
      console.log(res);
    }, err => {
      this.snackBar.open(err.message, "Close");
    })
  }

  saveConfig(): void {
    var config = {
      google_password: this.info.google_password,
      google_username: this.info.google_username,
      dirble_token: this.info.dirble_token
    }
    this.sharedService.saveConfig(this.info).subscribe(res => {
      this.snackBar.open("Saved!", "Close");
    }, err => {
      this.snackBar.open(err.message, "Close");
    })
  }

  addFavorites(url: string, title: string): void {
    this.sharedService.addFavorites(url, title).subscribe(res => console.log);
  }

  removeFavorites(id: string): void {
    this.sharedService.removeFavorites(id).subscribe(res => console.log);
  }

  private checkNewVersion(currentVersion: string): void {
    this.http.get("https://api.github.com/repos/ivanblazevic/radix/releases/latest").subscribe(res => {
      this.newVersion = res["tag_name"];
      this.updateAvailable = compareVersions(this.newVersion, currentVersion);
    })
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}