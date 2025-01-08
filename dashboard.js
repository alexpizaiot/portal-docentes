import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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
    const gestorMenuItem = document.getElementById("gestorMenuItem");
    const gestorSection = document.getElementById("gestorSection");
    const addUserForm = document.getElementById("addUserForm");
    const emailInput = document.getElementById("emailInput");
    const levelSelect = document.getElementById("levelSelect");
    const userList = document.getElementById("userList");

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        try {
            await signOut(auth);
            window.location.href = 'index.html';
        } catch (error) {
            console.error("Erro ao sair:", error);
        }
    });

    // Mostrar opções do gestor
    const userLevel = new URLSearchParams(window.location.search).get("nivel");
    if (userLevel === "gestor") {
        gestorMenuItem.classList.remove("d-none");
        gestorMenuItem.addEventListener("click", () => {
            gestorSection.classList.remove("d-none");
            loadUsers();
        });

        // Adicionar evento para alternar entre abas
        document.getElementById("cadastro-tab").addEventListener("click", () => {
            document.getElementById("cadastro").classList.add("show", "active");
            document.getElementById("usuarios").classList.remove("show", "active");
        });

        document.getElementById("usuarios-tab").addEventListener("click", () => {
            document.getElementById("usuarios").classList.add("show", "active");
            document.getElementById("cadastro").classList.remove("show", "active");
            loadUsers();
        });

        // Adicionar usuário
        addUserForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            const nivel = levelSelect.value;

            try {
                await addDoc(collection(db, "autorizados"), { email, nivel });
                alert("Usuário adicionado com sucesso!");
                addUserForm.reset();
                loadUsers();
            } catch (error) {
                console.error("Erro ao adicionar usuário:", error);
            }
        });
    }

    // Função para carregar usuários cadastrados
    async function loadUsers() {
        userList.innerHTML = "";
        const querySnapshot = await getDocs(collection(db, "autorizados"));
        querySnapshot.forEach((doc) => {
            const user = doc.data();
            const div = document.createElement("div");
            div.className = "d-flex justify-content-between align-items-center mb-2";
            div.innerHTML = `
                <span>E-mail: ${user.email} | Nível: ${user.nivel}</span>
                <div>
                    <button class="btn btn-sm btn-warning edit-btn" data-id="${doc.id}">Editar</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${doc.id}">Excluir</button>
                </div>
            `;
            userList.appendChild(div);
        });

        // Adicionar eventos de edição e exclusão
        document.querySelectorAll(".edit-btn").forEach((btn) =>
            btn.addEventListener("click", async (e) => {
                const id = e.target.dataset.id;
                const newNivel = prompt("Digite o novo nível (docente ou gestor):");
                if (newNivel) {
                    try {
                        await updateDoc(doc(db, "autorizados", id), { nivel: newNivel });
                        alert("Nível atualizado com sucesso!");
                        loadUsers();
                    } catch (error) {
                        console.error("Erro ao editar usuário:", error);
                    }
                }
            })
        );

        document.querySelectorAll(".delete-btn").forEach((btn) =>
            btn.addEventListener("click", async (e) => {
                const id = e.target.dataset.id;
                if (confirm("Tem certeza que deseja excluir este usuário?")) {
                    try {
                        await deleteDoc(doc(db, "autorizados", id));
                        alert("Usuário excluído com sucesso!");
                        loadUsers();
                    } catch (error) {
                        console.error("Erro ao excluir usuário:", error);
                    }
                }
            })
        );
    }
});
