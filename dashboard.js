import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, addDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD9cXBzN-b5z-390MWcmIpTjuNyKhWXhCo",
    authDomain: "portaldocentes-fb404.firebaseapp.com",
    projectId: "portaldocentes-fb404",
    storageBucket: "portaldocentes-fb404.firebasestorage.app",
    messagingSenderId: "837457806876",
    appId: "1:837457806876:web:c2d8104e26c2ad96d041d9"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", async () => {
    // Botão de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                console.log("dashboard.js: Iniciando o signout");
                await signOut(auth);
                console.log("dashboard.js: Signout realizado com sucesso");
                window.location.href = 'index.html'; // Redirecionar para a página inicial
            } catch (error) {
                console.error("dashboard.js: Erro ao sair:", error);
                alert('Erro ao sair. Consulte o console para mais detalhes.');
            }
        });
    }

    // Verificar o nível de acesso do usuário autenticado
    const userLevel = new URLSearchParams(window.location.search).get("nivel");
    const gestorMenuItem = document.getElementById("gestorMenuItem");
    const gestorSection = document.getElementById("gestorSection");

    if (userLevel === "gestor") {
        // Exibir o menu "Gestor" para usuários do nível gestor
        if (gestorMenuItem) gestorMenuItem.classList.remove("d-none");

        // Exibir a seção de cadastro ao clicar no menu "Gestor"
        gestorMenuItem.addEventListener("click", () => {
            if (gestorSection) gestorSection.classList.remove("d-none");
        });

        // Lógica para gravar os dados no Firestore
        const addUserForm = document.getElementById("addUserForm");
        const emailInput = document.getElementById("emailInput");
        const levelSelect = document.getElementById("levelSelect");

        if (addUserForm) {
            addUserForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const email = emailInput.value.trim();
                const nivel = levelSelect.value;

                try {
                    await addDoc(collection(db, "autorizados"), {
                        email: email,
                        nivel: nivel,
                    });
                    alert("Usuário adicionado com sucesso!");
                    addUserForm.reset();
                } catch (error) {
                    console.error("Erro ao gravar no Firestore:", error);
                    alert("Erro ao adicionar usuário. Consulte o console.");
                }
            });
        }
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

    // Controle do Menu Lateral Responsivo
    const menuButton = document.getElementById('menuButton');
    const sidebar = document.getElementById('sidebar');

    if (menuButton && sidebar) {
        // Mostrar/ocultar o menu lateral ao clicar no botão
        menuButton.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Fechar o menu lateral ao clicar fora dele
        document.addEventListener('click', (event) => {
            if (!sidebar.contains(event.target) && !menuButton.contains(event.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
});
