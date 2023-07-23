import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FacebookAuthProvider, getAuth, GoogleAuthProvider, signInWithPhoneNumber, signInWithPopup } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FirebaseAuthService {

  userData: Observable<firebase.User>;

  constructor(private angularFireAuth: AngularFireAuth) {
    this.userData = angularFireAuth.authState;
  }

  signUp(email: string, password: string) {
    this.angularFireAuth['createUserWithEmailAndPassword'](email, password)
      .then(res => {
        console.log('You are Successfully signed up!', res);
      })
      .catch(error => {
        console.log('Something is wrong:', error.message);
      });
  }

  signIn(email: string, password: string) {
    this.angularFireAuth['signInWithEmailAndPassword'](email, password)
      .then(res => {
        console.log('res:', res)
        console.log('You\'re in !');
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  signOut() {
    this.angularFireAuth['signOut']()
  }

  async signInGoogleFacebook(providerName: string) {
    const auth = getAuth();
    const provider = (providerName === 'google') ? new GoogleAuthProvider() : new FacebookAuthProvider();
    return signInWithPopup(auth, provider)
      .then((result) => {
        console.log('result:', result)
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        return result.user;
        // ...
      }).catch((error) => {
        console.log('error:', error)
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

}

