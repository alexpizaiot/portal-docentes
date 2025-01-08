// Importação das funções do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD9cXBzN-b5z-390MWcmIpTjuNyKhWXhCo",
    authDomain: "portaldocentes-fb404.firebaseapp.com",
    projectId: "portaldocentes-fb404",
    storageBucket: "portaldocentes-fb404.firebasestorage.app",
    messagingSenderId: "837457806876",
    appId: "1:837457806876:web:c2d8104e26c2ad96d041d9"
};

// Inicializar Firebase
document.addEventListener("DOMContentLoaded", () => {
    try {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);
        console.log("Firebase inicializado com sucesso.");

        // Selecionar elementos
        const loginBtn = document.getElementById("loginBtn");
        const status = document.getElementById("status");
        const loading = document.getElementById("loading");

        // Evento de clique no botão de login
        loginBtn.addEventListener("click", async () => {
            console.log("Botão clicado. Iniciando login...");
            status.innerText = "";
            loading.style.display = "block"; // Exibir mensagem de carregamento

            const provider = new GoogleAuthProvider();
            try {
                // Abrir a janela de login do Google
                const result = await signInWithPopup(auth, provider);
                console.log("Login bem-sucedido:", result);

                // Obter informações do usuário
                const user = result.user;
                const userEmail = user.email;
                console.log("Usuário autenticado:", userEmail);

                // Verificar se o e-mail está autorizado no Firestore
                const q = query(collection(db, "autorizados"), where("email", "==", userEmail));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    console.log("Documento(s) encontrado(s) no Firestore:", querySnapshot.docs.map(doc => doc.data()));
                    const userData = querySnapshot.docs[0].data(); // Primeiro documento encontrado
                    console.log("Nível de acesso encontrado:", userData.nivel);

                    // Redirecionar com base no nível de acesso
                    status.innerText = "Acesso concedido. Bem-vindo!";
                    if (userData.nivel === "gestor") {
                        window.location.href = 'dashboard.html?nivel=gestor';
                    } else if (userData.nivel === "docente") {
                        window.location.href = 'dashboard.html?nivel=docente';
                    } else {
                        status.innerText = "Nível de acesso não configurado.";
                        await signOut(auth);
                    }
                } else {
                    console.error("Nenhum documento encontrado para o e-mail:", userEmail);
                    status.innerText = "Seu e-mail não está autorizado.";
                    await signOut(auth);
                }
            } catch (error) {
                console.error("Erro ao fazer login:", error.message);
                status.innerText = "Erro ao fazer login. Tente novamente.";
            } finally {
                loading.style.display = "none"; // Ocultar mensagem de carregamento
            }
        });
    } catch (error) {
        console.error("Erro ao inicializar o Firebase:", error);
    }
});
