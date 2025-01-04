import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

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

document.addEventListener("DOMContentLoaded", () => {
    // Botão de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            try {
                console.log("dashboard.js: Iniciando o signout");
                signOut(auth)
                    .then(() => {
                        console.log("dashboard.js: Signout realizado com sucesso");
                        window.location.href = 'index.html'; // Redirecionar para a página inicial
                    })
                    .catch((error) => {
                        console.error("dashboard.js: Erro ao sair:", error);
                        alert('Erro ao sair. Consulte o console para mais detalhes.');
                    });
            } catch (error) {
                console.error("dashboard.js: Erro ao sair:", error);
                alert('Erro ao sair. Consulte o console para mais detalhes.');
            }
        });
    }

    // Navegação suave para links
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const href = link.getAttribute("href");
            if (href !== "#") {
                if (href === "#controle-evasao") {
                    window.open("https://forms.office.com/r/fBNbhiYfsb", "_blank");
                } else {
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: "smooth" });
                    }
                }
            }
        });
    });

    // Botão de menu (para dispositivos móveis)
    const menuButton = document.createElement("button");
    menuButton.textContent = "☰"; // Ícone do menu
    menuButton.classList.add("btn", "btn-light", "d-md-none");
    document.querySelector("body").prepend(menuButton); // Adiciona o botão no topo da página

    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
        menuButton.addEventListener("click", (event) => {
            event.stopPropagation(); // Impede que o clique se propague para outros eventos
            sidebar.classList.toggle("active");
        });

        document.addEventListener('click', (event) => {
            if (!sidebar.contains(event.target) && !menuButton.contains(event.target)) {
                sidebar.classList.remove("active");
            }
        });
    }
});
