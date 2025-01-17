import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { UserService } from '../../../services/user.service';
import { DragDropModule, CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { DndDirective } from '../../directives/dnd.directive';

@Component({
  selector: 'app-file',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatDialogModule, MatButtonModule, DragDropModule,],
  templateUrl: './file.component.html',
  styleUrl: './file.component.scss'
})
export class FileComponent {
  @Input() progress = 0;
  @ViewChild("fileDropRef", { static: false }) fileDropEl!: ElementRef;
  files: any[] = [];
  selectedFiles: any[] = [];
  isDragging = false;
  droppedData: string | null = null;
  uploaded:boolean=false;
  count:number=0;
  // uploadedFiles:any=[]; 
  // uploadedFiles = [
  //   { name: "sample", type: "pdf", size: "112kb" },
  //   { name: "sample2", type: "png", size: "112kb" }

  // ];
  uploadedFiles: any = [];
  type: any = "";
  isSingle: any;
  PreviewImage: string = "../../../assets/img/img_placeholder.jpg";
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FileComponent>,
    public userService: UserService,
  ) {

  }
  onFileSelected(event: any) {
    const array = Array.from(event.target.files);
    // this.selectedFiles = Array.from(event.target.files);
    array.forEach((data:any)=>{
      data.progress = 0;
    })
    console.log(array)
    for (let i = 0; i < array.length; i++) {
   
      this.selectedFiles.push(array[i])
    }
    // for (let i = 0; i < this.selectedFiles.length; i++) {
    //   this.uploadedFiles.push({ name: this.selectedFiles[i].name, type: this.selectedFiles[i].type, size: this.selectedFiles[i].size, progress: 0 })
    // }
    
    this.prepareFilesList()
  }
  async uploadFiles() {
    if (this.selectedFiles.length === 0) return;
    const formData = new FormData;

    this.selectedFiles.forEach(file => {
      formData.append('files', file);
    });
    this.userService.uploadFile(formData).subscribe((res: any) => {
      this.doAction();
    })
  }
  doAction() {
    this.dialogRef.close({ event: "Add File" });
  }

  uploadFilesSimulator(index: number) {
    // this
    setTimeout(() => {
      if (index === this.selectedFiles.length) {
        this.uploaded = true;
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.selectedFiles[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.selectedFiles[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

   prepareFilesList() {
    this.uploadFilesSimulator(0);
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
    this.selectedFiles.forEach((data:any)=>{
      data.progress = 0;
    }) 
    console.log(this.selectedFiles)
    this.prepareFilesList();
  }


}
