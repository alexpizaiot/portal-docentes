import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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

document.addEventListener("DOMContentLoaded", async () => {
    const logoutBtn = document.getElementById('logoutBtn');
    const addUserForm = document.getElementById("addUserForm");
    const emailInput = document.getElementById("emailInput");
    const levelSelect = document.getElementById("levelSelect");
    const userList = document.getElementById("userList");

    // Função para carregar usuários
    const loadUsers = async () => {
        userList.innerHTML = ""; // Limpa a lista antes de carregar
        try {
            const querySnapshot = await getDocs(collection(db, "autorizados"));
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const li = document.createElement("li");
                li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
                li.innerHTML = `
                    E-mail: ${data.email} | Nível: ${data.nivel}
                    <div>
                        <button class="btn btn-sm btn-warning edit-btn" data-id="${doc.id}" data-email="${data.email}" data-nivel="${data.nivel}">Editar</button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${doc.id}">Excluir</button>
                    </div>
                `;
                userList.appendChild(li);
            });

            // Adiciona eventos de clique para edição e exclusão
            const editButtons = document.querySelectorAll(".edit-btn");
            const deleteButtons = document.querySelectorAll(".delete-btn");

            editButtons.forEach(button => {
                button.addEventListener("click", handleEditUser);
            });

            deleteButtons.forEach(button => {
                button.addEventListener("click", handleDeleteUser);
            });
        } catch (error) {
            console.error("Erro ao carregar usuários:", error);
        }
    };

    // Função para adicionar um novo usuário
    if (addUserForm) {
        addUserForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            const nivel = levelSelect.value;

            try {
                await addDoc(collection(db, "autorizados"), { email, nivel });
                alert("Usuário adicionado com sucesso!");
                addUserForm.reset();
                loadUsers(); // Recarrega a lista após adicionar
            } catch (error) {
                console.error("Erro ao adicionar usuário:", error);
                alert("Erro ao adicionar usuário. Consulte o console.");
            }
        });
    }

    // Função para editar um usuário
    const handleEditUser = async (e) => {
        const id = e.target.dataset.id;
        const currentEmail = e.target.dataset.email;
        const currentNivel = e.target.dataset.nivel;

        const newNivel = prompt(`Editar nível de acesso para o usuário ${currentEmail}`, currentNivel);
        if (newNivel && newNivel !== currentNivel) {
            try {
                const userRef = doc(db, "autorizados", id);
                await updateDoc(userRef, { nivel: newNivel });
                alert("Usuário atualizado com sucesso!");
                loadUsers();
            } catch (error) {
                console.error("Erro ao atualizar usuário:", error);
                alert("Erro ao atualizar usuário. Consulte o console.");
            }
        }
    };

    // Função para excluir um usuário
    const handleDeleteUser = async (e) => {
        const id = e.target.dataset.id;
        const confirmation = confirm("Tem certeza que deseja excluir este usuário?");
        if (confirmation) {
            try {
                const userRef = doc(db, "autorizados", id);
                await deleteDoc(userRef);
                alert("Usuário excluído com sucesso!");
                loadUsers();
            } catch (error) {
                console.error("Erro ao excluir usuário:", error);
                alert("Erro ao excluir usuário. Consulte o console.");
            }
        }
    };

    // Carregar usuários ao carregar a página
    loadUsers();

    // Botão de logout
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
});
