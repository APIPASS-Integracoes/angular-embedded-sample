import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-embedded-sample';
  public accessToken = '<your-access-token>';
  // @ts-ignore
  public iframeUrl;

  constructor(protected _sanitizer: DomSanitizer,
              private httpClient: HttpClient) {
  }

  openClassroom() {
    this.iframeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(`https://authorization.apipass.com.br/authorization/new-authorization?token=${this.accessToken}&provider=GOOGLE_CLASSROOM`)
  }

  ngOnInit(): void {
    // After the authorization is saved, the iframe emits an message event with the saved authorization data
    window.addEventListener('message', ({data}) => {
      if (data?.savedAuthorization) {
        // Here we get the saved authorization id and send it to an APIPASS flow, where we create a link of the authorization id with your costumer identifier
        this.httpClient.post('https://core.apipass.com.br/api/<your-apipass-company-id>/activate-auth', {
          authorizationId: data.savedAuthorization.id,
          customerId: '<your-customer-id>'
        }).subscribe(value => {
          console.log({value})
          this.iframeUrl = '';
        })
      }
    });
  }
}
