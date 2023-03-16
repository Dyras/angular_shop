import { Component } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  isUserLoggedIn: boolean | null = null;
  re = /\S+@\S+\.\S+/;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(this.re),
  ]);

  passwordLength = 8;
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(8),
  ]);

  matcher = new MyErrorStateMatcher();

  constructor(private router: Router) {
    document.title = 'Johans webbshop - Registrering';

    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.isUserLoggedIn = true;
        this.router.navigate(['/products']);
      } else {
        console.log('User is not logged in');
        this.isUserLoggedIn = false;
      }
    });
  }

  loginHandler() {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email.value, password.value).then(
      (userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log('User is logged in');
        this.isUserLoggedIn = true;
      }
    );
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
