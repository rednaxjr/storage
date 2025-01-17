import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule, FormControl, FormGroup, } from '@angular/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator, } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource, } from '@angular/material/table';
@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MatIconModule, CommonModule, ReactiveFormsModule, FormsModule, MatTableModule, MatPaginatorModule],
   templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() labels: any[] = [];
  @ContentChild(TemplateRef) actions?: any;
  

  constructor(
    private router: Router, 
  ) { 
  }
  ngOnInit(): void {
   
  }
  async sort(data: { field: string }, index: number) { 
    const isAscending = (this.labels[index].sort = !this.labels[index].sort); 
    this.data.sort((a, b) => {
      const comparison = a[data.field] < b[data.field] ? -1 : a[data.field] > b[data.field] ? 1 : 0;
      return isAscending ? comparison : -comparison;
    });
  
    console.log(this.labels[index]);
  }


}
