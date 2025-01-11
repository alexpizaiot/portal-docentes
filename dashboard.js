import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD9cXBzN-b5z-390MWcmIpTjuNyKhWXhCo",
    authDomain: "portaldocentes-fb404.firebaseapp.com",
    projectId: "portaldocentes-fb404",
    storageBucket: "portaldocentes-fb404.appspot.com",
    messagingSenderId: "837457806876",
    appId: "1:837457806876:web:c2d8104e26c2ad96d041d9"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            // Redirecionar para a página de login
            window.location.href = 'index.html';
        } else {
            console.log("Usuário autenticado:", user.email);
            initializeDashboard(user);
        }
    });
});

function initializeDashboard(user) {
    const usuariosMenuItem = document.getElementById("usuariosMenuItem");
    const cadastroHorariosMenuItem = document.getElementById("cadastroHorariosMenuItem");
    const menuButton = document.getElementById("menuButton");
    const sidebar = document.getElementById("sidebar");

    // Controle do menu para nível gestor
    const userLevel = new URLSearchParams(window.location.search).get("nivel");
    if (userLevel === "gestor") {
        usuariosMenuItem.classList.remove("d-none");
        cadastroHorariosMenuItem.classList.remove("d-none");
    }

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        try {
            await signOut(auth);
            window.location.href = 'index.html';
        } catch (error) {
            console.error("Erro ao sair:", error);
        }
    });

    // Controle do menu hambúrguer
    menuButton.addEventListener("click", () => {
        sidebar.classList.toggle("active");
    });

    document.addEventListener("click", (event) => {
        if (!sidebar.contains(event.target) && !menuButton.contains(event.target)) {
            sidebar.classList.remove("active");
        }
    });
}
