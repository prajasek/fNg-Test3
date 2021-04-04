import { EventEmitter, Injectable, Output } from '@angular/core';
import { Users } from 'src/assets/users.model';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  
  // user attributes
  START_INDEX: number = 0;
  pageNo: number;
  displayedpageNo: number;
  totalUsers: number;
  tableData: Users[];

  @Output() onPageChange = new EventEmitter<number>();   // to filter service
  
  constructor() {

   }

   getIndex(){
     return this.pageNo;
   }

   pageChanged(){
     this.onPageChange.emit(this.pageNo);
   }

   

}
