import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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

    // Verificar nível de acesso e exibir menu "Gestor"
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userEmail = user.email;
            console.log("Usuário autenticado:", userEmail);

            try {
                const docRef = doc(db, "autorizados", userEmail);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    console.log("Dados do usuário no Firestore:", userData);

                    // Verificar nível de acesso
                    if (userData.nivel === "gestor") {
                        console.log("Nível de acesso: Gestor");
                        const gestorMenuItem = document.createElement("li");
                        gestorMenuItem.classList.add("nav-item");
                        gestorMenuItem.innerHTML = `
                            <a class="nav-link" href="#gestor-form">
                                <i class="fas fa-user-cog"></i> Administrador
                            </a>
                        `;
                        document.querySelector(".nav").appendChild(gestorMenuItem);

                        // Exibir formulário do gestor
                        const gestorForm = document.getElementById("gestor-form");
                        if (gestorForm) {
                            gestorForm.style.display = "block";
                        }
                    } else {
                        console.log("Nível de acesso: Não é gestor");
                    }
                } else {
                    console.error("Documento não encontrado no Firestore para o e-mail:", userEmail);
                }
            } catch (error) {
                console.error("Erro ao obter dados do Firestore:", error.message);
            }
        } else {
            console.log("Nenhum usuário autenticado.");
            window.location.href = 'index.html'; // Redirecionar para a página de login
        }
    });

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
});
