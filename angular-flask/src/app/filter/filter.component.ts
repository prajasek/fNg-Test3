import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { FilterService } from '../filter.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  // all Countries, States, Cities from the Database
  countries: string[];
  states: string[];
  cities: string[];

  // selected Country, State and City
  country: string;
  state: string;
  city: string;

  // 
  dropDownStatus: boolean = false;

  constructor(private http: HttpService,
              private filter: FilterService) { 

    // set 'this.countries' for *ngFor directive
    // in the template
    this.http.gotAllData.subscribe(() => {
      this.countries = this.http.getAllCountries();
      console.log(this.countries);
    })
  }
  
  clearSearchTerms(clear: string){
    if (clear == 'all'){
    this.country = this.state = this.city = "";
    this.cities = this.states = this.countries = []; 
    }

    else if (clear == 'stateCity'){
      this.city = this.state = "";
      this.cities = this.states = [];
    }

    else if (clear == 'city') {
      this.city = "";
      this.cities = [];
    }
  }


  resetFilters(){  
    this.dropDownStatus = false;
    this.filter.setDropdownStatus(false);
    this.clearSearchTerms('all');
    }


/*  -----  Events   ------ */
  onChangeCountry(event){
    this.clearSearchTerms("stateCity")
    this.dropDownStatus = true;
    this.country = event.value;
    this.onlyCountrySelected(this.country);
  }
  

  onChangeState(event){
    this.clearSearchTerms("city");
    this.state = event.value;
    this.countryStateSelected(this.country, this.state);
  }

  onChangeCity(event){
    this.city = event.value;
    this.countryStateCitySelected(this.country, this.state, this.city);
  }


/*  -----  Get response to Events from Filter Service ------ */
  onlyCountrySelected(cntry: string){
    console.log("country selected")
    this.filter.selectedCountry(cntry);
    this.filter.gotNewData.subscribe(() => {
      this.states = this.filter.statesFromCountry;
    });
  }

  countryStateSelected(cntry:string, st: string){
    this.filter.selectedCountryState(cntry, st);
    this.filter.gotNewData.subscribe(() => {
      this.cities = this.filter.citiesFromState;
    });
  }

  countryStateCitySelected(cntry:string, st: string, cty: string){
    this.filter.selectedCountryStateCity(cntry, st, cty)
  }

  ngOnInit(){

  }

}
