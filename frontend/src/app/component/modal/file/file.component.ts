import { Component, ElementRef, Inject, Input, ViewChild, ChangeDetectorRef, AfterViewInit, signal, effect } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { UserService } from '../../../services/user.service';
import { DragDropModule, CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { DndDirective } from '../../directives/dnd.directive';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpUploadProgressEvent } from '@angular/common/http';
import { filter, forkJoin, map, Observable, tap } from 'rxjs';
@Component({
  selector: 'app-file',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatDialogModule, MatButtonModule, DragDropModule,],
  templateUrl: './file.component.html',
  styleUrl: './file.component.scss'
})
export class FileComponent implements AfterViewInit {

  @ViewChild("fileDropRef", { static: false }) fileDropEl!: ElementRef;
  files: any[] = [];
  progress3: any;
  selectedFiles: any[] = [];  
  uploaded: boolean = false; 
  uploadedFiles: any = [];
  type: any = "";
  PreviewImage: string = "../../../assets/img/img_placeholder.jpg";
  progress: { [key: string]: number } = {};
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FileComponent>,
    public userService: UserService,
    public http: HttpClient
  ) {


  }
  ngAfterViewInit(): void {
     
  }

  ngOnInit() {
  } 


  onFileSelected(event: any) {
    const array = Array.from(event.target.files);
    // this.selectedFiles = Array.from(event.target.files);
    array.forEach((data: any) => {
      data.progress = 0;
    })

    for (let i = 0; i < array.length; i++) {
      this.selectedFiles.push(array[i])
    }

    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.selectedFiles[i].progress = 0;
      this.uploadedFiles.push({ name: this.selectedFiles[i].name, type: this.selectedFiles[i].type, size: this.selectedFiles[i].size, progress: 0 })
    }
  }
  async uploadFiles() {
    if (this.selectedFiles.length === 0) return; 
    const uploadObservables = this.selectedFiles.map((file) => {
      const formData = new FormData();
      formData.append('files', file); 
      return this.userService.uploadFile(formData).pipe(
        tap((res: any) => {
          if (res.type === HttpEventType.UploadProgress && res.total) {
            file.progress = Math.round((100 * res.loaded) / res.total);
          }
        }),
        filter((res: any) => res.type === HttpEventType.Response),  
        map((res: any) => res.body)  
      );
    });
    forkJoin(uploadObservables).subscribe({
      next: (responses) => {
       
        setTimeout(()=>{ 
          console.log("All uploads complete:", responses);
          this.dialogRef.close({ event: "Add File" });
        },3000)
     
      },
      error: (err) => {
        console.error("Upload error:", err);
      },
    });
  } 

  deleteFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }
  formatBytes(bytes: any, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
  }
  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileDrop(files);
    }
  }
  handleFileDrop(files: any): void {
    for (let i = 0; i < files.length; i++) {

      this.selectedFiles.push(files[i])
    }
    this.selectedFiles.forEach((data: any) => {
      data.progress = 0;
    })
    console.log(this.selectedFiles)
  }


}
