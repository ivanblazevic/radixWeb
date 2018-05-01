import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

export interface Info {
  title: string
}

@Injectable()
export class SharedService {

  host: string = "http://192.168.0.16:8080";

  constructor(private http: HttpClient) { }

  getInfo(): Observable<Info> {
    return this.http.get<Info>(this.host);
  }

  play(): Observable<Info> {
    return this.http.get<Info>(this.host);
  }


  /*
  token = "c9ddafa9add4a6578cb542fa4e";
  serverHost = "https://radix-83cd.restdb.io/rest/stations";
  */

  //let endpoint: string = "http://api.dirble.com/v2/search?query=" + this.searchText + "&token=" + this.token;
  /*
  http.post(endpoint, {}).subscribe(res => {
    console.log(res);
    // this.stations = res;
  })
  */

}
