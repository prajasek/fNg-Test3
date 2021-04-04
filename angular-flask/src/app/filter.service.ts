import { ComponentFactoryResolver, EventEmitter, Injectable, Output } from '@angular/core';
import { HttpService } from './http.service';
import { Users } from '../assets/users.model'
import { TableService } from './table.service';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  @Output() dropDownEvent = new EventEmitter<boolean>();
  @Output() gotNewData = new EventEmitter<void>();   // let Table and Filter component know new data has been received
  
  dropDownStatus: boolean;

  country: string;
  state: string;
  city: string;
  totalUsers: number;

  // response from server GET request
  dataForTable: Users[];         // to Table
  statesFromCountry: string[];   // populate States dropdown based on Country selected
  citiesFromState: string[];     // populate Cities dropdown based on Country and State selected



  /* methods */
  constructor(private http: HttpService,
              private table: TableService) {

      this.country = this.state = this.city = "";


      this.table.onPageChange
      .subscribe((pageIndex: number) => {
        this.http.getGeolocs(this.country, this.state, this.city, pageIndex)
          .subscribe((resp) => {
            console.log("calling from constructor of filter service")
            this.dataForTable = resp['table_data'];
            this.gotNewData.emit();
        });
      });                                    
  }


  setDropdownStatus(status: boolean){
    this.dropDownStatus = status;
    this.dropDownEvent.emit(this.dropDownStatus);
  }


  selectedCountry(cntry: string) {
    this.state = "";
    this.country = cntry;
    const pageIndex = 0;
    this.setDropdownStatus(true);
    this.http.getGeolocs(cntry, "", "", pageIndex)
    .subscribe((resp) => {
      this.statesFromCountry = resp['states'];
      this.dataForTable = resp['table_data']; 
      this.totalUsers = resp['row_count']
      this.gotNewData.emit();
    });
  }


  selectedCountryState(cntry: string, state: string) {
    this.country = cntry;
    this.state = state;
    this.city = "";
    const pageIndex = this.table.pageNo;
    this.http.getGeolocs(cntry, state, "", pageIndex)
    .subscribe((resp) => {
      this.citiesFromState = resp['cities'];
      this.dataForTable = resp['table_data'];
      this.totalUsers = resp['row_count']
      this.gotNewData.emit();
    });

  }


  selectedCountryStateCity(cntry: string, state: string, city: string) {
    this.country = cntry;
    this.state = state;
    this.city = city;
    const pageIndex = this.table.pageNo;
    this.http.getGeolocs(cntry, state, city, pageIndex)
    .subscribe((resp) => {
      this.dataForTable = resp['table_data'];
      this.totalUsers = resp['row_count']
      this.gotNewData.emit();
    });
   }
}
