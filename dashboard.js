import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

    // Configuração do Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyD9cXBzN-b5z-390MWcmIpTjuNyKhWXhCo",
        authDomain: "portaldocentes-fb404.firebaseapp.com",
        projectId: "portaldocentes-fb404",
        storageBucket: "portaldocentes-fb404.firebasestorage.app",
        messagingSenderId: "837457806876",
        appId: "1:837457806876:web:c2d8104e26c2ad96d041d9"
    };

    // google client Id, criado no passo 2
    const CLIENT_ID = '1067241825747-5i4mt2ud9m4q3qos8s0hn2ar4jgg256m.apps.googleusercontent.com';
    // google drive API scope.
    const SCOPES = 'https://www.googleapis.com/auth/drive.file';
    // id da pasta criada no google drive, criada no passo 3.
    const FOLDER_ID = '1HwqWTzcmIoOWWxjHHBF9xq9LOmcSTUig';
     const REDIRECT_URI = 'https://portal-docentes.vercel.app/oauth2callback'
        let tokenClient;
        let gapiInited = false;
   // Initialize the Google API client
    function handleClientLoad() {
      gapi.load('client', initClient);
        console.log('dashboard.js: gapi carregado.');
    }

    async function initClient() {
       try {
             await gapi.client.init({
               clientId: CLIENT_ID,
                scope: SCOPES,
           });
              console.log('dashboard.js: gapi inicializado.');
             gapiInited = true;
           } catch(error){
            console.error("dashboard.js: Erro ao inicializar a API do Google", error);
         }
    };
    async function signIn(){
            console.log('dashboard.js: Iniciando a função signIn()...');
            if(gapiInited === false) {
               alert('dashboard.js: A api do google não foi inicializada, tente novamente!');
                return false;
            }
             console.log('dashboard.js: gapiInited === true.');
           tokenClient = google.accounts.oauth2.initTokenClient({
              client_id: CLIENT_ID,
              scope: SCOPES,
              redirect_uri: REDIRECT_URI,
              callback: '', // workaround for gapi issue
            });
             console.log('dashboard.js: tokenClient criado.');
             try{
               await new Promise(resolve =>{
                 tokenClient.callback = async (resp) => {
                     if (resp.error !== undefined) {
                        throw (resp);
                   }
                       resolve(resp);
                  };
               tokenClient.requestAccessToken();
               console.log('dashboard.js: accessToken requisitado com sucesso.');
              });
                 return true;
           } catch(error){
               console.error("dashboard.js: Houve um problema ao fazer o login com o google, tente novamente", error);
                alert("dashboard.js: Houve um problema ao fazer o login com o google, tente novamente");
                return false;
           }
       }
document.addEventListener("DOMContentLoaded", async () => {
    // Inicializar Firebase
         console.log('dashboard.js: Inicializando o Firebase...');
        try{
        const app = initializeApp(firebaseConfig);
         console.log('dashboard.js: Firebase inicializado com sucesso.');
    } catch (error){
          console.error("dashboard.js: Erro ao inicializar o Firebase:", error);
    }
    handleClientLoad();
    await initClient();
    
    const logoutBtn = document.getElementById('logoutBtn');
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const confirmLogout = confirm("Tem certeza que deseja sair do sistema?");
            if(confirmLogout){
             const auth = getAuth();
            try {
                await signOut(auth);
                window.location.href = 'index.html';
            } catch (error){
                    console.error("Erro ao sair:", error);
            }
          }
        });

    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", async (e) =>{
            e.preventDefault();
            const href = link.getAttribute("href");
            if (href !== "#"){
             if (href === "#controle-evasao"){
                   window.open("https://forms.office.com/r/fBNbhiYfsb", "_blank");
                } else if (href === "#enviar-documentos"){
                    const signInSuccess = await signIn();
                     if(signInSuccess) {
                        console.log('dashboard.js: signIn concluido, redirecionando para enviar-documentos.html');
                          window.location.href = 'enviar-documentos.html';
                       }
                } else {
                     const targetElement = document.querySelector(href);
                     if (targetElement) {
                       targetElement.scrollIntoView({behavior: "smooth"});
                    }
                  }
             }
         });
    });

    // Adiciona um listener para o botão de menu em telas menores
    const menuButton = document.createElement("button");
    menuButton.textContent = "☰"; // Ícone do menu
    menuButton.classList.add("btn", "btn-light", "d-md-none");
    document.querySelector("body").prepend(menuButton); // Adiciona o botão no topo da página

    const sidebar = document.getElementById("sidebar");

    menuButton.addEventListener("click", (event) => {
        event.stopPropagation(); // impede que o clique se propague para outros eventos
        sidebar.classList.toggle("active");
    });
    
    document.addEventListener('click', (event) => {
        if(!sidebar.contains(event.target) && !menuButton.contains(event.target)) {
            sidebar.classList.remove("active");
        }
    });
});

 async function uploadFile(file){
    const metadata = {
        mimeType: file.type,
        parents: [FOLDER_ID],
        name: file.name
    }

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  try{
    const response = await gapi.client.request({
            path: 'https://www.googleapis.com/upload/drive/v3/files',
            method: 'POST',
            params: {uploadType: 'multipart'},
            body: form,
    });

    if (response.status == 200) {
       console.log('File uploaded successfully:', response.result.id);
       return response.result;
    } else{
       console.error("Erro ao fazer o upload", response);
       return null;
    }
  } catch (error){
    console.error("Erro ao fazer o upload", error);
    return null;
  }
}

export { uploadFile }