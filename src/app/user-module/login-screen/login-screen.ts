import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-screen',
  imports: [ReactiveFormsModule],
  templateUrl: './login-screen.html',
  styleUrl: './login-screen.css'
})
export class LoginScreen {

  loginForm: FormGroup;

  emailErrorMessege: string;
  passwordErrorMessege: string;
  loginEfetuado: string;
  loginRecusado: string;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    //Quando a tela iniciar.

    //Inicia o formulario
    //Cria o campo obrigatório de email.
    //Cria o campo obrigatório de senha.
    this.loginForm = this.fb.group({

      email: ["", [Validators.required]],
      password: ["", [Validators.required]]

    });

    this.emailErrorMessege = "";
    this.passwordErrorMessege = "";
    this.loginEfetuado = ""
    this.loginRecusado = ""

  }

  async onLoginClick() {

    //alert("Botão de login clicado.");
    this.emailErrorMessege = "";
    this.passwordErrorMessege = "";
    this.loginEfetuado = "";
    this.loginRecusado = "";


    console.log("Email", this.loginForm.value.email);
    console.log("Password", this.loginForm.value.password);

    if (this.loginForm.value.email == "") {


      this.emailErrorMessege = "O Campo de e-mail é obrigatório."
      return;
    }

    if (this.loginForm.value.password == "") {
      this.passwordErrorMessege = "O Campo de Senha é obrigatório."
      return;
    }



    let response = await fetch("https://senai-gpt-api.azurewebsites.net/login", {
      method: "POST", //ENVIAR,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      })
    });

    console.log("STATUS CODE", response.status)

    if (response.status >= 200 && response.status <= 299) {
      this.loginEfetuado = "Acesso Autorizado, carregando informações"

      let json = await response.json();


      console.log("JSON", json)

      let meuToken = json.accessToken;
      let meuId = json.user.id;

      localStorage.setItem("meuToken", meuToken);
      localStorage.setItem("meuId", meuId);

      window.location.href = "chat"



    } else {
      this.loginRecusado = "Acesso Negado, Verifique seus dados"

      //alert("Acesso Negado")
    }


    this.cd.detectChanges();
  }
}
