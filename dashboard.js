import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, doc, setDoc, addDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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

    // Gravar dados no Firestore
    const formGravarDados = document.getElementById("formGravarDados");
    if (formGravarDados) {
        formGravarDados.addEventListener("submit", async (e) => {
            e.preventDefault();

            // Obter valores do formulário
            const emailInput = document.getElementById("emailInput").value;
            const nivelInput = document.getElementById("nivelInput").value;

            console.log("Tentando gravar no Firestore com os seguintes dados:");
            console.log("ID do Documento (email):", emailInput);
            console.log("Dados:", { email: emailInput, nivel: nivelInput });

            try {
                // Configurar o documento com o email como ID
                const userRef = doc(db, "autorizados", emailInput);
                await setDoc(userRef, {
                    email: emailInput,
                    nivel: nivelInput,
                });

                console.log("Gravação no Firestore realizada com sucesso!");
                alert("Dados gravados com sucesso no Firestore!");
                formGravarDados.reset(); // Limpar o formulário
            } catch (error) {
                console.error("Erro ao gravar no Firestore:", error.message);
                alert("Erro ao gravar no Firestore. Consulte o console.");
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
