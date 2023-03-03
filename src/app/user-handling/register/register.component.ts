import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
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
  constructor() {}

  ngOnInit(): void {
    document.title = 'Johans webbshop - Registrering';
  }

  accountHandler() {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    /*const passwordRepeat = document.getElementById(
      'passwordRepeat'
    ) as HTMLInputElement;
    */
    const emailValue = email.value;
    const passwordValue = password.value;

    // const passwordRepeatValue = passwordRepeat.value;
    if (
      this.validateEmail(emailValue) &&
      this.validatePassword(passwordValue)
      // && passwordValue === passwordRepeatValue
    ) {
      this.createAccount(emailValue, passwordValue);
    }
  }

  validateEmail(email: string) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  validatePassword(password: string) {
    if (password.length >= this.passwordLength) {
      return true;
    } else {
      return false;
    }
  }

  createAccount(email: string, password: string) {
    console.log(email, password);
    // const auth = getAuth();
    // createUserWithEmailAndPassword(auth, email, password)
    //   .then((userCredential) => {
    //     // Signed in
    //     const user = userCredential.user;
    //     // ...
    //   })
    //   .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     // ..
    //   });
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
