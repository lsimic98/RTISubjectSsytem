import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../services/FileUpload/file-upload.service';


@Component({
  selector: 'app-rti-odsek',
  templateUrl: './rti-odsek.component.html',
  styleUrls: ['./rti-odsek.component.css']
})
export class RtiOdsekComponent implements OnInit {

  
  shortLink: string = ""; 
  loading: boolean = false; // Flag variable 
  file: File = null; // Variable to store file 
  files: File[];
  // Inject service  
  constructor(
    private fileUploadService: FileUploadService,
    private httpClient: HttpClient
    ) { } 

  ngOnInit(): void { 
  } 

  // On file Select 
  onChange(event) { 
      this.file = event.target.files[0]; 
  }
  
  selectMultipleFiles(event)
  {
    if(event.target.files.length > 0)
    {
      this.files =  event.target.files;
    }

  }

  // OnClick of button Upload 
  onUpload() {  
      console.log(this.file); 
      this.fileUploadService.uploadSingle(this.file, 'testFolder').subscribe( 
          (event: any) => { 
              if (typeof (event) === 'object') { 

                  // Short link via api response 
                 

                  this.loading = false; // Flag variable  
              } 
          } 
      ); 
  }
  
  onMultipleUpload()
  {
    console.log(this.file);
    const formData = new FormData();
    for(let file of this.files){
      formData.append('files', file);
    }

    this.httpClient.post<any>('http://localhost:4000/uploadMultiple', formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)

    );

  }



}
