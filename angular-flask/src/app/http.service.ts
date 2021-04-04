import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Users } from '../assets/users.model'


@Injectable({ providedIn: 'root' })
export class HttpService {
  
  /* attributes */
  COUNTRIES: string[];  
  STATES: string[];
  CITIES: string[];
  @Output() gotAllData = new EventEmitter<void>();


  /* methods */
  constructor(private http: HttpClient) {
  }


  getData(index) {
    const options = { 
            responseType : 'json' as const,
            params: {"page_index": index}
    };
    return this.http.get<Users[]>('http://127.0.0.1:5000/users', options)
  }

  updateCountriesforSelect(countries: string[]){
    this.COUNTRIES = countries;
    this.gotAllData.emit();
  }

  getAllCountries(){
    return this.COUNTRIES;
  }

  getGeolocs(cntry: string, state: string, city: string, pageIndex: number) {
    
    console.log("FROM GET REQUEST")
    console.log(cntry)
    console.log(state)
    console.log(city)
    console.log(pageIndex)

    const options = {
      responseType : 'json' as const,
      params: {"search_country": cntry, 
               "search_state": state,
               "search_city": city,
               "page_index": String(pageIndex)
              }
    };
  return this.http.get<string[]>('http://127.0.0.1:5000/geoloc', options)
  }


}
