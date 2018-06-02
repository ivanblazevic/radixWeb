import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface Info extends Config {
  title: string,
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

  //host: string = "https://radix.local:8009";
  host: string = "http://localhost:8080";
  //host: string = "";
  dirble: string = "http://api.dirble.com/v2/search?query=";
  dirbleToken: string = "c9ddafa9add4a6578cb542fa4e";
  favoritesHost: string = "https://radix-83cd.restdb.io/rest/stations";

  constructor(private http: HttpClient) { }

  getInfo(): Observable<Info> {
    return this.http.get<Info>(this.host + "/info");
  }

  getFavorites(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-apikey': '5ae89d7625a622ae4d528762'
      })
    };
    const endpoint = this.favoritesHost;
    return this.http.get<Info>(endpoint, httpOptions);
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

  update(): Observable<any> {
    return this.http.get<Info>(this.host + "/update");
  }

}
