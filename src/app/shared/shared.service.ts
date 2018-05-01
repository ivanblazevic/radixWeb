import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface Info extends Config {
  title: string,
  volume: number,
  version: string
}

export interface Config {
  googleUsername?: string,
  googlePassword?: string
}

@Injectable()
export class SharedService {

  host: string = "https://radix.local:8009";
  dirble: string = "http://api.dirble.com/v2/search?query=";
  dirbleToken: string = "c9ddafa9add4a6578cb542fa4e";
  favoritesHost: string = "https://radix-83cd.restdb.io/rest/stations";

  constructor(private http: HttpClient) { }

  getInfo(): Observable<Info> {
    return this.http.get<Info>(this.host);
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
    const endpoint: string = this.dirble + query + "&token=" + this.dirbleToken;
    return this.http.get<Info>(endpoint);
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
