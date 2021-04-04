import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Users } from '../../assets/users.model'
import { FilterService } from '../filter.service';
import { HttpService } from '../http.service';
import { TableService } from '../table.service';


@Component({
  selector: 'search-table-component',
  styleUrls: ['search-table.component.css'],
  templateUrl: 'search-table.component.html',
})
export class SearchTableComponent implements OnInit {

  // Angular Table attributes
  displayedColumns: string[] = ['Order_ID', 'First_Name', 'Last_Name', 'Email', 'Product_ID', 'Quantity', 'Unit_Price', 'Country', 'State', 'City'];
  dataSource: MatTableDataSource<Users>;
  @ViewChild(MatSort) sort: MatSort;
  
  // user attributes
  START_INDEX: number = 0;
  pageNo: number;
  displayedpageNo: number;
  totalUsers: number;
  
  constructor(private http: HttpService,
              private table: TableService,
              private filter: FilterService) {

    this.filter.gotNewData
    .subscribe(() => { 
      console.log("GOT NEW DATA")
      this.dataSource = new MatTableDataSource(this.filter.dataForTable);
      this.dataSource.sort = this.sort;
      this.totalUsers = this.filter.totalUsers;
    })
  }

  ngOnInit() {
    console.log("Table initiliazed")
    this.pageNo = this.START_INDEX;
    this.displayedpageNo = this.START_INDEX + 1;
    this.table.pageNo = this.pageNo;  
    console.log("ngoninit")

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
        this.table.pageNo = this.pageNo;
        this.displayedpageNo = this.pageNo + 1;
        this.table.pageChanged();
    }
    else {
        console.log(event.charCode);
        this.pageNo = event.target.value - 1 >=0 ? event.target.value - 1 : 0;
        this.table.pageNo = this.pageNo;
        this.displayedpageNo = this.pageNo + 1;
        this.table.pageChanged();
    }
  }

  nextPage(){
    this.pageNo = this.pageNo + 1 ;
    this.table.pageNo = this.pageNo;
    this.displayedpageNo = this.pageNo + 1;
    console.log(this.pageNo)
    this.table.pageChanged();
  }

  previousPage(){
    this.pageNo = this.pageNo-1 >= 0 ? this.pageNo-1 : 0 ;
    this.table.pageNo = this.pageNo;
    this.displayedpageNo = this.pageNo + 1;
    console.log(this.pageNo)
    this.table.pageChanged();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue)
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }
}
