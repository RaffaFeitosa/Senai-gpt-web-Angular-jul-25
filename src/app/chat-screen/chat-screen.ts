import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface IChat {

  chatTitle: string;
  id: number;
  userId: string;

}

interface IMesssage {

  chatId: number;
  id: number;
  text: string;
  userId: string;

}
@Component({
  selector: 'app-chat-screen',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chat-screen.html',
  styleUrl: './chat-screen.css'
})
export class ChatScreen {

  chats: IChat[];
  chatSelecionado: IChat;
  mensagens: IMesssage[];
  mensagenUsuario = new FormControl("");

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) { //constro a clase
    this.chats = [];
    this.chatSelecionado = null!;
    this.mensagens = [];
  }

  ngOnInit() { //Executado quando o Angular está pronto para rodar \\Buscar dados na API.

    this.getChats();

  }

  async getChats() {
    //Método que busca os chats da API.
    // let response = await this.http.get("https://senai-gpt-api.azurewebsites.net/chats", {
    ///    headers: {
    //    "Authorization": "Bearer " + localStorage.getItem("meuToken")
    //   }
    // }).toPromise();

    let response = await firstValueFrom(this.http.get("https://senai-gpt-api.azurewebsites.net/chats", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }
    }));

    if (response) {


      this.chats = response as [];
      console.log("Chats", response)

    } else {

      console.log("Erro ao buscar os chats.");

    }

    this.cd.detectChanges();
  }
  async onChatClick(chatClicado: IChat) {

    console.log("Chat Clicado", chatClicado);

    this.chatSelecionado = chatClicado;

    //Lógica para buscar as mensagens.
    let response = await firstValueFrom(this.http.get("https://senai-gpt-api.azurewebsites.net/messages?chatId=" + chatClicado.id, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("meuToken")

      }
    }));
    console.log("MENSAGENS", response);

    this.mensagens = response as IMesssage[];

    this.cd.detectChanges();

  }
  async enviarMensagem () {

    let novaMensagemUsuario = {

      //id
      chatId: this.chatSelecionado.id,
      userId: localStorage.getItem("meuId"),
      text: this.mensagenUsuario.value


    };

  }
}
