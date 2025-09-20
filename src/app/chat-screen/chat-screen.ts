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
    })) as IChat[];

    if (response) {



      let userId = localStorage.getItem("meuId");

      response = response.filter(chat => chat.userId == userId);

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
  async enviarMensagem() {

    let novaMensagemUsuario = {

      //id
      chatId: this.chatSelecionado.id,
      userId: localStorage.getItem("meuId"),
      text: this.mensagenUsuario.value


    };
    let novaMensagemUsuarioResponse = await firstValueFrom(this.http.post("https://senai-gpt-api.azurewebsites.net/messages", novaMensagemUsuario, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }
    }));
    // Atualiza as msg da tela
    await this.onChatClick(this.chatSelecionado);

    //2 Respostas da IA
    let respostaIAResponse = await firstValueFrom(this.http.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
      "contents": [
        {
          "parts": [
            {
              "text": this.mensagenUsuario.value + ". Me de uma resposta objetiva."
            }
          ]
        }
      ]
    }, {
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": "AIzaSyDV2HECQZLpWJrqCKEbuq7TT5QPKKdLOdo"
      }
    })) as any

    let novaRespostaIA = {
      chatId: this.chatSelecionado.id,
      userId: "chatbot",
      text: respostaIAResponse.candidates[0].content.parts[0].text
    }


    //3 - SAlva a resposta da IA no Banco de dados

    let novaRespostaIAResponse = await firstValueFrom(this.http.post("https://senai-gpt-api.azurewebsites.net/messages", novaRespostaIA, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }
    }));

    await this.onChatClick(this.chatSelecionado);
  }
  async novoChat() {

    const nomeChat = prompt("Digite o nome do novo chat:");

    if (!nomeChat) {
      alert("Nome Invalido.");
      return;

    }

    const novoChatObj = {

      chatTitle: nomeChat,
      userId: localStorage.getItem("meuId")
      //id
    }

    let novoChatresponse = await firstValueFrom(this.http.post("https://senai-gpt-api.azurewebsites.net/chats", novoChatObj, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }
    })) as IChat;

    await this.getChats();

    await this.onChatClick(novoChatresponse);

  }
    deslogar() {

      //1 alternatica
     // localStorage.removeItem("meuToken");
     // localStorage.removeItem("meuId");
     //2 alternativa
     localStorage.clear();

     window.location.href = "login";

    }

}
