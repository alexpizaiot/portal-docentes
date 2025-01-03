import { uploadFile } from './dashboard.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

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

    let tokenClient;
    let gapiInited = false;
    console.log('enviar-documentos.js: Iniciando a API do Google...');
     // Initialize the Google API client
    function handleClientLoad() {
          gapi.load('client', initClient);
          console.log('enviar-documentos.js: gapi carregado.');
    }
     // Initialize the client
    async function initClient() {
         await gapi.client.init({
           clientId: CLIENT_ID,
           scope: SCOPES,
         });
           console.log('enviar-documentos.js: gapi inicializado com sucesso.');
           gapiInited = true;
    };
   initClient();

document.addEventListener('DOMContentLoaded', () => {
// Inicializar Firebase
    try{
        console.log('enviar-documentos.js: Inicializando o Firebase...');
    const app = initializeApp(firebaseConfig);
     const db = getFirestore(app);
     const auth = getAuth(app);
     console.log('enviar-documentos.js: Firebase inicializado com sucesso.');
} catch (error){
        console.error("enviar-documentos.js: Erro ao inicializar o Firebase:", error);
}

const documentForm = document.getElementById('documentForm');
const statusDiv = document.getElementById('status');

documentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nomeDocente = document.getElementById('nomeDocente').value;
    const turma = document.getElementById('turma').value;
    const tipoDocumento = document.getElementById('tipoDocumento').value;
    const dataDocumento = document.getElementById('dataDocumento').value;
    const arquivoPdf = document.getElementById('arquivoPdf').files[0];

    statusDiv.textContent = 'Enviando documento...';

     try {
         const fileUpload = await uploadFile(arquivoPdf);
            if(fileUpload){
                 console.log('enviar-documentos.js: Arquivo enviado para o Drive com sucesso');
                const docRef = await addDoc(collection(db, "documentos"), {
                    nomeDocente: nomeDocente,
                    turma: turma,
                    tipoDocumento: tipoDocumento,
                    dataDocumento: dataDocumento,
                    fileId: fileUpload.id,
                    fileLink: fileUpload.webViewLink,
                    user: auth.currentUser.email,
                    timestamp: new Date(),
                });
               statusDiv.textContent = 'Documento enviado com sucesso!';
                console.log('enviar-documentos.js: Dados enviados para o firestore com sucesso.');
                documentForm.reset();
             } else{
                 statusDiv.textContent = 'Erro ao fazer upload do arquivo.';
                  console.log('enviar-documentos.js: Erro ao enviar o documento.');
             }
    }
    catch(error){
         console.error('enviar-documentos.js: Erro ao enviar o documento:', error);
        statusDiv.textContent = 'Erro ao enviar o documento, tente novamente.';
    }
});
});