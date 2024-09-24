import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(8),
      ]),
    });
  }

  login() {
    this.authService.login(this.loginForm.value).subscribe(
      (user: any) => {
        if (user.length === 0)
          alert('Erreur dans le pseudo ou le mot de passe');
        this.authService.user = user[0];
        if (!this.authService.user) return;
        this.authService.saveUser();
        this.router.navigate(['/']);
      },
      (error) => {
        alert('Erreur dans la requête');
      }
    );
  }
}
