import { Component, OnInit } from '@angular/core';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { WindowService } from 'src/app/services/window.service';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  windowRef: any;
  signInMethod: string = 'email';
  email: string;
  password: string;
  phone: string
  isCodeSent: boolean
  code: string;

  constructor(private firebaseAuth: FirebaseAuthService, private win: WindowService) { }

  signUp(email, password) {
    this.firebaseAuth.signUp(email, password);
  }
  signIn() {
    this.firebaseAuth.signIn(this.email, this.password);
    // this.firebaseAuth.signIn('levy6162@gmai.com', '123456');
  }
  signOut() {
    this.firebaseAuth.signOut();
  }

  async signInGoogleFacebook(providerName: string) {
    const user = await this.firebaseAuth.signInGoogleFacebook(providerName);
		console.log("TCL: LoginComponent -> signInGoogleFacebook -> user", user)
  }

  phoneAuth() {
    this.signInMethod = 'phone';
    const auth = getAuth()
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
    this.windowRef.recaptchaVerifier.render();
  }

  sendCode() {
    firebase.auth().signInWithPhoneNumber(this.phone, this.windowRef.recaptchaVerifier)
      .then((confirmationResult) => {
        console.log('confirmationResult:', confirmationResult)
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        this.isCodeSent = true;
        this.windowRef.confirmationResult = confirmationResult;
        // ...
      }).catch((error) => {
        console.log('error:', error)
        // Error; SMS not sent
        // ...
      });
    // signInWithPhoneNumber(auth,this.phone, this.windowRef.recaptchaVerifier)
    // signInWithPhoneNumber(auth, this.phone, this.windowRef.recaptchaVerifier)
  }

  loginWithCode() {
    // const code = getCodeFromUserInput();
    this.windowRef.confirmationResult.confirm(this.code).then((result) => {
      console.log('result:', result)
      // User signed in successfully.
      const user = result.user;
      // ...
    }).catch((error) => {
      // User couldn't sign in (bad verification code?)
      // ...
    });
  }
  ngOnInit(): void {
  }

}
