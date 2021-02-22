import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  uri = 'http://localhost:4000';
    
  constructor(private http:HttpClient) { } 
  
  // Returns an observable 
  uploadSingle(file: any, path: string, korime: string, ime: string, prezime: string):Observable<any> { 
  
      // Create form data 
      const formData = new FormData();  
        
      // Store form name as "file" with file data 
      formData.append("file", file, file.name);
      // formData.append("subfolder", 'testFolder') 
        
      // Make http post request over api 
      // with formData as req 
      return this.http.post(`${this.uri}/uploadSingle`, formData, {
        headers: { 
          'subfolder': path,
          'korime': korime,
          'ime': ime,
          'prezime': prezime
        }
    }); 
  } 


  uploadMultiple(files: File[])
  {
    
    const formData = new FormData();
    for(let file of files){
      formData.append('files', file);
    }

    this.http.post<any>('http://localhost:4000/uploadMultiple', formData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)

    );

  }


}
