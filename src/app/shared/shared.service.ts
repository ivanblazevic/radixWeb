import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface Info {
  title: string
}

@Injectable()
export class SharedService {

  host: string = "https://radix.local:8009";
  favoritesHostToken = "c9ddafa9add4a6578cb542fa4e";
  favoritesHost = "https://radix-83cd.restdb.io/rest/stations";

  constructor(private http: HttpClient) { }

  getInfo(): Observable<Info> {
    return this.http.get<Info>(this.host);
  }

  getFavorites(): Observable<any> {
    // const endpoint: string = "http://api.dirble.com/v2/search?query=" + this.searchText + "&token=" + this.token;
    const httpOptions = {
      headers: new HttpHeaders({
        'x-apikey': '5ae89d7625a622ae4d528762'
      })
    };

    const endpoint = this.favoritesHost;
    return this.http.get<Info>(endpoint, httpOptions);
  }

  play(): Observable<Info> {
    return this.http.get<Info>(this.host);
  }




  //
  /*
  http.post(endpoint, {}).subscribe(res => {
    console.log(res);
    // this.stations = res;
  })
  */

}
