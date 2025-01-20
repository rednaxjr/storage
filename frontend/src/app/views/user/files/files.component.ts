import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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
import { MatButtonToggleModule } from '@angular/material/button-toggle';
@Component({
  selector: 'app-files',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, MatTableModule, MatPaginatorModule, MatIconModule, TableComponent, MatDialogModule, FileComponent, MatButtonToggleModule],
  templateUrl: './files.component.html',
  styleUrl: './files.component.scss'
})
export class FilesComponent implements OnInit {
  selectedFiles: File[] = [];
  type: any = "";
  isSingle: any;
  file_name: any;
  searchFile: string = "";
  date: any = null;
  date_preview: any = null;
  tov: any = "list"
  table_headers = [

    { text: "Name", field: "name", sort: true },
    { text: "Date Uploaded", field: "date", sort: true },
    { text: "Action", field: "action", sort: true },
  ];
  files_data: any = [];
  files_data_duplicate: any = [];
  constructor(
    private dialog: MatDialog,
    public userService: UserService,
  ) {

  }
  ngOnInit(): void {
    this.getAllFiles();
  }
  changeView(event: any): void {
    console.log(this.tov);
  }
  async getAllFiles() {
    this.files_data = [];
    this.userService.getUploadedFiles().subscribe((res: any) => {
      this.files_data = res.files;
      this.files_data_duplicate = this.files_data;
    })
  }

  openModal() {
    const title = "Upload"
    var date: any = [];
    var logs: any = [];
    let dialogRef = this.dialog.open(FileComponent, {
      panelClass: 'custom-container',
      height: '75%',
      width: '80%',
      autoFocus: true,
      disableClose: true,
      data: { title: title, date: date, logs: logs }
    });

    dialogRef.afterClosed().subscribe(res => {

      if (res.event == "Add File") {
        this.getAllFiles();
        alert("file added")
      }
    });

  }

  async download(data: any) {
    const confirmDownload = confirm("Are you sure you want to download this file?");
    if (confirmDownload) {
      this.userService.downloadFile(data).subscribe({
        next: (res: Blob) => {
          const url = window.URL.createObjectURL(res);
          const a = document.createElement('a');
          a.href = url;
          a.download = data.name; // Use the file name for the download
          a.click();
          window.URL.revokeObjectURL(url); // Clean up the object URL
        },
        error: (err) => {
          console.error("Error downloading the file:", err);
        },
      });
    } else {
      console.log("Download canceled.");
    }
  }

   
  async deleteFile(data: any) {
    const datas = {
      name: data.name,
    }
    if (confirm("are you sure you want to delete this?") == true) {
      this.userService.deleteFile(datas).subscribe((res: any) => {

        alert("File Deleted")
        this.getAllFiles();
      })
    } else {
      console.log("cancel")
    }
  }

  view(data: any) {
    const datas = {
      name: data.name
    }
    this.userService.viewFile(datas).subscribe((res: any) => {
      if (data.type == "video/mp4") {
        const videoURL = `http://localhost:3000/viewFile`;
        const videoWindow = window.open(videoURL, '_blank');
      } else {
        const fileURL = window.URL.createObjectURL(res);
        window.open(fileURL);
        // window.open()
      }

    })
  }
  search(data: any) {
    this.searchFile = data.target.value;
    this.filter()
  }
  DateFilter(data: any) {
    this.date_preview = data.target.value;
    this.date = new Date(data.target.value).toLocaleString('default', {
      year: 'numeric',
      day: '2-digit',
      month: 'long',
    });
    this.filter();
  }
  filter() {
    this.files_data = this.files_data_duplicate;
    if (this.searchFile && !this.date) {
      this.files_data = this.files_data.filter(
        (data: any) =>
          data.name.toLowerCase().indexOf(this.searchFile.toLowerCase()) !== -1
      );
    } else if (this.searchFile && this.date) {
      this.files_data = this.files_data.filter(
        (data: any) =>
          data.name.toLowerCase().indexOf(this.searchFile.toLowerCase()) !== -1
          && data.date === this.date
      );
    } else if (!this.searchFile && this.date) {
      this.files_data = this.files_data.filter(
        (data: any) =>
          data.date === this.date
      );
    }

  }
  clearDate(): void {
    this.date = null; // Clear the date value
    this.date_preview = null;
    this.filter(); // Reapply filters
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }
} 