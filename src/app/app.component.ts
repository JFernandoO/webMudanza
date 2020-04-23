import { Component } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';


import {Registro} from './models/Registro';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'front-mudanzas';
  newRegistro : Registro = new Registro();

  public constructor(private http: HttpClient) {}

  public upload(event: any): void {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('name', this.newRegistro.name);

  const headers = new HttpHeaders();
  this.http.post('http://localhost:65355/api/Enlistment', formData, { headers, responseType: 'text' })
    .pipe(
      map(res => this.downloadFile2(res.toString() , "reporte.txt","application/octet-stream")),
      catchError(error => of(console.error('got error', error))))
      .subscribe(() => console.log('next'), error => console.log(error))
  }

downloadFile2(data, filename, mime) {
 
  // It is necessary to create a new blob object with mime-type explicitly set
  // otherwise only Chrome works like it should
  const blob = new Blob([data], {type: mime || 'application/octet-stream'});
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // IE doesn't allow using a blob object directly as link href.
    // Workaround for "HTML7007: One or more blob URLs were
    // revoked by closing the blob for which they were created.
    // These URLs will no longer resolve as the data backing
    // the URL has been freed."
    window.navigator.msSaveBlob(blob, filename);
    return;
  }
  // Other browsers
  // Create a link pointing to the ObjectURL containing the blob
  const blobURL = window.URL.createObjectURL(blob);
  const tempLink = document.createElement('a');
  tempLink.style.display = 'none';
  tempLink.href = blobURL;
  tempLink.setAttribute('download', filename);
  // Safari thinks _blank anchor are pop ups. We only want to set _blank
  // target if the browser does not support the HTML5 download attribute.
  // This allows you to download files in desktop safari if pop up blocking
  // is enabled.
  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank');
  }
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(blobURL);
  }, 100);
}

}
