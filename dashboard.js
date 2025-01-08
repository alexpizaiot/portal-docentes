import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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
            await signOut(auth);
            window.location.href = 'index.html';
        });
    }

    // Verificar o nível de acesso do usuário autenticado
    const userLevel = new URLSearchParams(window.location.search).get("nivel");
    const gestorMenuItem = document.getElementById("gestorMenuItem");
    const gestorSection = document.getElementById("gestorSection");

    if (userLevel === "gestor") {
        if (gestorMenuItem) gestorMenuItem.classList.remove("d-none");
        if (gestorSection) gestorSection.classList.remove("d-none");

        // Lógica para cadastrar usuário
        const addUserForm = document.getElementById("addUserForm");
        const emailInput = document.getElementById("emailInput");
        const levelSelect = document.getElementById("levelSelect");

        if (addUserForm) {
            addUserForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const email = emailInput.value.trim();
                const nivel = levelSelect.value;

                try {
                    await addDoc(collection(db, "autorizados"), { email, nivel });
                    alert("Usuário adicionado com sucesso!");
                    addUserForm.reset();
                } catch (error) {
                    console.error("Erro ao gravar no Firestore:", error);
                    alert("Erro ao adicionar usuário.");
                }
            });
        }

        // Lógica para listar usuários
        const usuariosTab = document.getElementById("usuarios-tab");
        const usuariosList = document.getElementById("usuariosList");

        if (usuariosTab) {
            usuariosTab.addEventListener("click", async () => {
                usuariosList.innerHTML = "";
                try {
                    const querySnapshot = await getDocs(collection(db, "autorizados"));
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        const listItem = document.createElement("li");
                        listItem.classList.add("list-group-item");
                        listItem.textContent = `E-mail: ${data.email} | Nível: ${data.nivel}`;
                        usuariosList.appendChild(listItem);
                    });
                } catch (error) {
                    console.error("Erro ao carregar usuários:", error);
                    alert("Erro ao carregar lista de usuários.");
                }
            });
        }
    }
});
