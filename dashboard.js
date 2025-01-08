import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_AUTH_DOMAIN",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    console.log("dashboard.js: DOM carregado.");

    // Verificar autenticação do usuário
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("dashboard.js: Usuário autenticado:", user.email);

            try {
                // Obter dados do Firestore
                const docRef = doc(db, "autorizados", user.email);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    console.log("dashboard.js: Dados do Firestore:", userData);

                    // Exibir o menu "Gestor" se o nível for gestor
                    if (userData.nivel === "gestor") {
                        console.log("dashboard.js: Usuário é um gestor.");
                        mostrarMenuGestor();
                    } else {
                        console.log("dashboard.js: Usuário não é gestor.");
                    }
                } else {
                    console.error("dashboard.js: Documento não encontrado no Firestore para o e-mail:", user.email);
                    alert("Você não está autorizado. Entre em contato com o administrador.");
                    signOut(auth);
                }
            } catch (error) {
                console.error("dashboard.js: Erro ao acessar o Firestore:", error.message);
                alert("Erro ao acessar os dados. Consulte o suporte.");
                signOut(auth);
            }
        } else {
            console.log("dashboard.js: Nenhum usuário autenticado. Redirecionando para login.");
            window.location.href = 'index.html'; // Redirecionar para a página de login
        }
    });

    // Função para exibir o menu "Gestor"
    function mostrarMenuGestor() {
        const gestorMenuItem = document.createElement("li");
        gestorMenuItem.classList.add("nav-item");
        gestorMenuItem.innerHTML = `
            <a class="nav-link" href="#gestor-form">
                <i class="fas fa-user-cog"></i> Administrador
            </a>
        `;
        document.querySelector(".nav").appendChild(gestorMenuItem);
    }

    // Botão de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("dashboard.js: Usuário clicou em logout.");
            signOut(auth)
                .then(() => {
                    console.log("dashboard.js: Logout realizado com sucesso.");
                    window.location.href = 'index.html'; // Redirecionar para login
                })
                .catch((error) => {
                    console.error("dashboard.js: Erro ao realizar logout:", error.message);
                });
        });
    }
});
