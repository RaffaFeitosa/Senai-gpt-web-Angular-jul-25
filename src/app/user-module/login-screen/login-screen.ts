import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-screen',
  imports: [ReactiveFormsModule],
  templateUrl: './login-screen.html',
  styleUrl: './login-screen.css'
})
export class LoginScreen {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    //Quando a tela iniciar.

    //Inicia o formulario
    //Cria o campo obrigatório de email.
    //Cria o campo obrigatório de senha.
    this.loginForm = this.fb.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required]]
    });

  }

  async onLoginClick() {

    //alert("Botão de login clicado.");

    console.log("Email", this.loginForm.value.email);
    console.log("Password", this.loginForm.value.password);

  //while (this.loginForm.value.email == "" && this.loginForm.value.password == "") {
  //alert ("Preencha email e senha")  BOA TENTATIVA
  if (this.loginForm.value.email == ""){
    alert ("Preencha o e-mail")
  return;
  }

  if (this.loginForm.value.password == ""){
    alert ("Preencha a senha")
  return;
    }

    }

    let response = await fetch("https://senai-gpt-api.azurewebsites.net/login", {



      method: "POST", //ENVIAR,
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      })
    });

    console.log ("STATUS CODE" , response.status)

    if(response.status>=200 && response.status <=299){
      alert("Acesso Autorizado")
    }else{
      alert("Acesso Negado")
    }

  }

}
