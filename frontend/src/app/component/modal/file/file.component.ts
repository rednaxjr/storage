import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef , MatDialogModule} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button'; 
import { MatIconModule, MatIcon } from '@angular/material/icon'; 
@Component({
  selector: 'app-file',
  standalone: true,
  imports: [MatIconModule, CommonModule,  MatDialogModule, MatButtonModule],
  templateUrl: './file.component.html',
  styleUrl: './file.component.scss'
})
export class FileComponent {
  selectedFiles:File[]=[];
  uploadedFiles:any=[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<FileComponent>,
  ){

  }
  onFileSelected(event:any){
   
  this.selectedFiles = Array.from(event.target.files); 
  }

  
}
