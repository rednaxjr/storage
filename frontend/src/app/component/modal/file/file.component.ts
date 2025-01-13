import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-file',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './file.component.html',
  styleUrl: './file.component.scss'
})
export class FileComponent {
  selectedFiles: File[] = [];
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

    this.selectedFiles = Array.from(event.target.files);
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.uploadedFiles.push({ name: this.selectedFiles[i].name, type: this.selectedFiles[i].type, size: (this.selectedFiles[i].size  ) + " MB" })
    }
    console.log(this.uploadedFiles)

    // if (this.selectedFiles) {
    //   const reader = new FileReader();
    //   for (let i = 0; i < this.selectedFiles.length; i++) {

    //     reader.onload = () => {
    //       const imageSrc = reader.result as string;

    //       const image = new Image();
    //       image.src = imageSrc;
    //       image.onload = () => {
    //         this.PreviewImage = imageSrc;

    //         const processedCanvas = this.processImagePreprocessed(image);
    //         console.log('Sorted Regions:', processedCanvas);
    //         this.processedImageSrc = processedCanvas.toDataURL();
    //       };
    //     };
    //     reader.readAsDataURL(file);

    //   }
    // }

  }
  async uploadFiles() {
    // for(let i =0;i<)
    if (this.selectedFiles.length === 0) return;
    const formData = new FormData;

    this.selectedFiles.forEach(file => {
      formData.append('files', file);
    }); 
    this.userService.uploadFile(formData).subscribe((res: any) => {
    
    
      this.doAction();
    })
  }
  doAction(){
    this.dialogRef.close({event:"Add File"});
  }


}
