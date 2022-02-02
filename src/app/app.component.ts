import {Component, OnInit} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {HttpClient} from "@angular/common/http";
import {ApipassSDK} from "@apipass/apipass-api-js-sdk/src/apipass-api-js-sdk";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-embedded-sample';
  public accessToken = '<your-access-token>';
  public iframeUrl: SafeResourceUrl | undefined;
  public company: any;

  constructor(protected _sanitizer: DomSanitizer,
              private httpClient: HttpClient) {
  }

  async openClassroom() {
    this.iframeUrl = this._sanitizer.bypassSecurityTrustResourceUrl(`https://authorization.apipass.com.br/authorization/new-authorization?token=${this.accessToken}&provider=GOOGLE_CLASSROOM`)
  }

  async ngOnInit(): Promise<void> {
    const token = '<YOUR TOKEN>';
    await ApipassSDK.init(token);
    this.company = await ApipassSDK.findCompany();
    this.watchAuthorizationSaved();
  }

  private watchAuthorizationSaved() {
    // After the authorization is saved, the iframe emits an message event with the saved authorization data
    window.addEventListener('message', ({data}) => {
      if (data?.savedAuthorization) {
        // Here we get the saved authorization id and send it to an APIPASS flow, where we create a link of the authorization id with your costumer identifier
        this.httpClient.post(`https://core.apipass.com.br/api/${this.company?.id}/activate-auth`, {
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
