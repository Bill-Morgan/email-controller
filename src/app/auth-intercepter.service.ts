import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EmailApiService } from "./email-api.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private emailSC: EmailApiService){}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        let reqWithAuth;
        if (!req.url.includes('api/v1/auth/authenticate-user')) {
            reqWithAuth = req.clone({'headers': req.headers.append("Authorization", this.emailSC.accessToken)})
        }
        return next.handle(reqWithAuth ? reqWithAuth : req);
    }
}