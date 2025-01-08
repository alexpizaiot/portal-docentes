import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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
    const logoutBtn = document.getElementById('logoutBtn');
    const gestorMenuItem = document.getElementById('gestorMenuItem');
    const cadastroSection = document.getElementById('cadastroSection');
    const usuariosCadastradosSection = document.getElementById('usuariosCadastradosSection');
    const addUserForm = document.getElementById('addUserForm');
    const emailInput = document.getElementById('emailInput');
    const levelSelect = document.getElementById('levelSelect');
    const usuariosLista = document.getElementById('usuariosLista');

    // Verificar autenticação do usuário
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        const userEmail = user.email;
        const querySnapshot = await getDocs(collection(db, "autorizados"));
        const userData = querySnapshot.docs.find(doc => doc.data().email === userEmail)?.data();

        if (!userData) {
            alert("Usuário não autorizado!");
            await signOut(auth);
            window.location.href = 'index.html';
            return;
        }

        const userLevel = userData.nivel;

        if (userLevel === "gestor") {
            gestorMenuItem.classList.remove('d-none');
        } else {
            gestorMenuItem.classList.add('d-none');
        }

        gestorMenuItem.addEventListener('click', () => {
            cadastroSection.classList.remove('d-none');
            usuariosCadastradosSection.classList.remove('d-none');
            carregarUsuarios();
        });
    });

    // Logout
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await signOut(auth);
            window.location.href = 'index.html';
        } catch (error) {
            console.error("Erro ao sair:", error);
        }
    });

    // Adicionar usuário
    addUserForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const nivel = levelSelect.value;

        if (!email) {
            alert("E-mail é obrigatório!");
            return;
        }

        try {
            await addDoc(collection(db, "autorizados"), { email, nivel });
            alert("Usuário adicionado com sucesso!");
            emailInput.value = "";
            levelSelect.value = "Docente";
            carregarUsuarios();
        } catch (error) {
            console.error("Erro ao adicionar usuário:", error);
            alert("Erro ao adicionar usuário. Consulte o console.");
        }
    });

    // Carregar lista de usuários
    async function carregarUsuarios() {
        usuariosLista.innerHTML = "";
        const querySnapshot = await getDocs(collection(db, "autorizados"));
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const userItem = document.createElement("div");
            userItem.className = "usuario-item";

            userItem.innerHTML = `
                <p>E-mail: ${data.email} | Nível: ${data.nivel}</p>
                <button class="btn btn-warning btn-sm editar-btn">Editar</button>
                <button class="btn btn-danger btn-sm excluir-btn">Excluir</button>
            `;

            // Editar usuário
            const editarBtn = userItem.querySelector(".editar-btn");
            editarBtn.addEventListener("click", async () => {
                const novoNivel = prompt("Digite o novo nível (gestor/docente):", data.nivel);
                if (novoNivel && (novoNivel === "gestor" || novoNivel === "docente")) {
                    try {
                        await updateDoc(doc(db, "autorizados", doc.id), { nivel: novoNivel });
                        alert("Nível atualizado com sucesso!");
                        carregarUsuarios();
                    } catch (error) {
                        console.error("Erro ao atualizar nível:", error);
                        alert("Erro ao atualizar nível. Consulte o console.");
                    }
                } else {
                    alert("Nível inválido!");
                }
            });

            // Excluir usuário
            const excluirBtn = userItem.querySelector(".excluir-btn");
            excluirBtn.addEventListener("click", async () => {
                if (confirm("Deseja realmente excluir este usuário?")) {
                    try {
                        await deleteDoc(doc(db, "autorizados", doc.id));
                        alert("Usuário excluído com sucesso!");
                        carregarUsuarios();
                    } catch (error) {
                        console.error("Erro ao excluir usuário:", error);
                        alert("Erro ao excluir usuário. Consulte o console.");
                    }
                }
            });

            usuariosLista.appendChild(userItem);
        });
    }
});
