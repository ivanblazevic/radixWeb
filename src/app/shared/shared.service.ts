import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, switchMap, tap } from 'rxjs/operators';

export interface Info extends Config {
  id?: string,
  title: string,
  playing?: string,
  volume: number,
  version: string
}

export interface Config {
  google_username?: string,
  google_password?: string,
  dirble_token?: string
}

@Injectable()
export class SharedService {
  host: string = environment.host;
  dirble: string = "http://api.dirble.com/v2/search?query=";
  favoritesHost: string = "https://radix-83cd.restdb.io/rest/stations";

  constructor(private http: HttpClient) {
    console.log("Host used: " + window.location.hostname)
    this.host = "http://" + window.location.hostname;
  }

  getInfo(): Observable<Info> {
    return this.http.get<Info>(this.host + "/info");
  }

  getFavorites(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-apikey': '5ae89d7625a622ae4d528762'
      })
    };

    const compare = (a,b) => {
      if (a.title < b.title)
        return -1;
      if (a.title > b.title)
        return 1;
      return 0;
    }

    const endpoint = this.favoritesHost;
    return this.http.get<any>(endpoint, httpOptions).pipe(map(m => {
      return m.sort(compare)
    }));
  }

  addFavorites(url: string, title: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-apikey': '5ae89d7625a622ae4d528762'
      })
    };
    const endpoint = this.favoritesHost;
    return this.http.post<Info>(endpoint, { url: url, title: title }, httpOptions);
  }

  removeFavorites(id: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-apikey': '5ae89d7625a622ae4d528762',
        "X-HTTP-Method-Override": "DELETE"
      })
    };
    const endpoint = this.favoritesHost;
    return this.http.post<Info>(endpoint + "/" + id, null, httpOptions);
  }

  searchStations(query: string): Observable<any> {
    return this.http.get<Info>(this.host + "/search?query=" + query);
  }

  searchGoogleMusic(query: string): Observable<any> {
    return this.http.get<Info>(this.host + "/gplay/search?search=" + query);
  }

  saveConfig(config: Config): Observable<any> {
    return this.http.post<any>(this.host, config);
  }

  play(): Observable<Info> {
    return this.http.get<Info>(this.host);
  }

  volume(volume: number): Observable<Info> {
    return this.http.get<Info>(this.host + "/volume?set=" + volume);
  }

  volumeByPercentage(volume: number): Observable<Info> {
    return this.getInfo().pipe(
      map(i => i.volume),
      tap(a => console.log(a)),
      switchMap(r => this.http.get<Info>(this.host + "/volume?set=" + (r + volume)))
    );
  }

  update(): Observable<any> {
    return this.http.get<Info>(this.host + "/update");
  }

}
