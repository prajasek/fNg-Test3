import {AfterContentChecked, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EventManager } from '@angular/platform-browser';
import { Users } from '../../assets/users.model'
import { HttpService } from '../http.service';


@Component({
  selector: 'table-component',
  styleUrls: ['table.component.css'],
  templateUrl: 'table.component.html',
})
export class TableComponent implements OnInit, AfterViewInit {

  // Angular Table attributes
  displayedColumns: string[] = ['Order_ID', 'First_Name', 'Last_Name', 'Email', 'Product_ID', 'Quantity', 'Unit_Price', 'Country', 'State', 'City'];
  dataSource: MatTableDataSource<Users>;
  @ViewChild(MatSort) sort: MatSort;
  
  // user attributes
  START_INDEX: number = 0;
  pageNo: number;
  displayedpageNo: number;
  totalUsers: number;
  
  constructor(private http: HttpService) {
  }

  ngOnInit(){
      this.loadData(this.START_INDEX);
      this.pageNo = this.START_INDEX;
      this.displayedpageNo = this.START_INDEX + 1;
  }

  ngAfterViewInit() {
    console.log("ngAftervIEW");
    this.dataSource.sort = this.sort;
  }

  loadData(index: number) {
    this.http.getData(index)
    .subscribe((resp) => {
      this.dataSource = new MatTableDataSource(resp['users']);
      this.totalUsers = resp['no_of_users'];
      this.setSort();
      this.http.updateCountriesforSelect(resp['countries']);
    })

  }

  updatePageNo(no: number){
    this.pageNo = 0;
    this.displayedpageNo = this.pageNo + 1;
  }

  setSort(){
    this.dataSource.sort = this.sort;
  }

  
  // input the page number
  pageDetect(event){
    const val = event.target.value;
    
    if (val < 0){
      event.target.value = 0;
    }

    if (!val || isNaN(Number(val))) {
        event.target.style.backgroundColor = "white";
        this.pageNo = 0;
        this.displayedpageNo = this.pageNo + 1;
        this.loadData(this.pageNo);
    }
    else {
        console.log(event.charCode);
        //event.target.style.backgroundColor = 'silver';
        this.pageNo = event.target.value - 1 >=0 ? event.target.value - 1 : 0;
        this.displayedpageNo = this.pageNo + 1;
        this.loadData(this.pageNo);
    }
  }


  nextPage(){
    this.pageNo = this.pageNo + 1 ;
    this.displayedpageNo = this.pageNo + 1;
    console.log(this.pageNo)
    this.loadData(this.pageNo);
  }

  previousPage(){
    this.pageNo = this.pageNo-1 >= 0 ? this.pageNo-1 : 0 ;
    this.displayedpageNo = this.pageNo + 1;
    console.log(this.pageNo)
    this.loadData(this.pageNo);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue)
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }
}
