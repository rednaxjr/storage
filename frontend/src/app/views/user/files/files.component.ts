import { Component, OnInit } from '@angular/core';
import { TableComponent } from '../../../component/table/table/table.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormsModule, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator, } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource, } from '@angular/material/table';
import { FileComponent } from '../../../component/modal/file/file.component';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatIconModule, TableComponent, MatDialogModule],
  templateUrl: './files.component.html',
  styleUrl: './files.component.scss'
})
export class FilesComponent implements OnInit {
  selectedFiles: File[] = [];
  type: any = "";
  isSingle: any;
  constructor(
    private dialog: MatDialog,
    public userService: UserService,
  ) {

  }
  ngOnInit(): void {

  }
  openModal() {
    const title = "Upload"

    var date: any = [];
    var logs: any = [];

    // const dialogConfig = new MatDialogConfig();

    // Configure the dialog options
    // dialogConfig.disableClose = true; // Prevents closing the dialog by clicking outside
    // dialogConfig.autoFocus = false;   // Disable autofocus to manually control focus
    // dialogConfig.width = '80%';       // Set the width of the dialog
    // dialogConfig.data = { id: 123, name: 'Angular' }; // Pass data to the dialog component
    //  dialogConfig.autoFocus = 'input[name="testName"]'; //Pass autoFoucs field
    // this.dialog.open(FileComponent, dialogConfig);

    let dialogRef = this.dialog.open(FileComponent, {
      panelClass: 'custom-container',
      height: '100%',
      width: '80%',
      autoFocus: true,
      disableClose: true,
      data: { title: title, date: date, logs: logs }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }
  // onFilesSelected(event: any): void {
  //   this.selectedFiles = Array.from(event.target.files);
  //   console.log('Selected files:', this.selectedFiles);
  // }
  onFilesSelected2(event: any) {
   
    this.selectedFiles = Array.from(event.target.files);
    if (this.selectedFiles.length === 0) return;
    console.log(this.selectedFiles.length)
    if (this.isSingle == 1) { 
      if (this.selectedFiles.length != 1) {
        console.log("invalid number of files")
      }  
    }else{
      if (this.selectedFiles.length <= 1 ) {
        console.log("invalid number of files")
      } 
    }

  }

  async uploadFiles() {
    if (this.selectedFiles.length === 0) return;
    const formData = new FormData;

    this.selectedFiles.forEach(file => {
      formData.append('files', file);
    });
    formData.append('isSingle', this.isSingle);
    this.userService.uploadFile(formData).subscribe((res: any) => {
      console.log(res.data)

    })
  }

  // async uploadFiles() {
  //   if (this.selectedFiles.length === 0) return;
  //   const formData = new FormData;

  //   this.selectedFiles.forEach(file => {
  //     formData.append('files', file);
  //   });

  //   console.log(formData)
  //   this.userService.uploadFile2(formData).subscribe((res: any) => {
  //     console.log(res.data)

  //   }, (error) => {
  //     console.log(error);
  //   })

  // }

}
