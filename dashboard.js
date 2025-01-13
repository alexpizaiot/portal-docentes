import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            // Redirecionar para a página de login
            window.location.href = 'index.html';
        } else {
            console.log("Usuário autenticado:", user.email);
            localStorage.setItem("usuarioLogado", user.email);

            // Carregar nível de acesso, se não estiver presente
            if (!localStorage.getItem("nivelAcesso")) {
                // Simulação de definição de nível (substitua pela lógica real)
                localStorage.setItem("nivelAcesso", "gestor"); // Exemplo fixo para teste
            }

            initializeDashboard(user);
        }
    });
});

function initializeDashboard(user) {
    const usuariosMenuItem = document.getElementById("usuariosMenuItem");
    const cadastroHorariosMenuItem = document.getElementById("cadastroHorariosMenuItem");
    const usuariosSection = document.getElementById("usuariosSection");
    const horariosSection = document.getElementById("horariosSection");
    const addUserForm = document.getElementById("addUserForm");
    const emailInput = document.getElementById("emailInput");
    const levelSelect = document.getElementById("levelSelect");
    const userList = document.getElementById("userList");
    const menuButton = document.getElementById("menuButton");
    const sidebar = document.getElementById("sidebar");

    const userLevel = localStorage.getItem("nivelAcesso");

    // Exibir menus com base no nível de acesso
    if (userLevel === "gestor") {
        if (usuariosMenuItem) usuariosMenuItem.classList.remove("d-none");
        if (cadastroHorariosMenuItem) cadastroHorariosMenuItem.classList.remove("d-none");

        // Menu Usuários
        if (usuariosMenuItem) {
            usuariosMenuItem.addEventListener("click", () => {
                if (usuariosSection) usuariosSection.classList.remove("d-none");
                if (horariosSection) horariosSection.classList.add("d-none");
                loadUsers();
            });
        }

        // Menu Cadastro de Horários
        if (cadastroHorariosMenuItem) {
            cadastroHorariosMenuItem.addEventListener("click", () => {
                window.location.href = "cadastro_horarios.html";
            });
        }
    } else {
        if (usuariosMenuItem) usuariosMenuItem.classList.add("d-none");
        if (cadastroHorariosMenuItem) cadastroHorariosMenuItem.classList.add("d-none");
    }

    // Função para carregar usuários cadastrados
    async function loadUsers() {
        userList.innerHTML = ""; // Limpa a lista antes de carregar
        try {
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
        } catch (error) {
            console.error("Erro ao carregar usuários:", error);
        }
    }

    // Adicionar novo usuário
    if (addUserForm) {
        addUserForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Previne o reload da página
            const email = emailInput.value;
            const nivel = levelSelect.value;

            if (!email || !nivel) {
                alert("Por favor, preencha todos os campos.");
                return;
            }

            try {
                await addDoc(collection(db, "autorizados"), { email, nivel });
                alert("Usuário adicionado com sucesso!");
                emailInput.value = ""; // Limpa o campo de e-mail
                levelSelect.value = ""; // Limpa o nível selecionado
                loadUsers(); // Recarrega a lista de usuários
            } catch (error) {
                console.error("Erro ao adicionar usuário:", error);
                alert("Não foi possível adicionar o usuário.");
            }
        });
    }

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        try {
            await signOut(auth);
            localStorage.clear(); // Limpa o estado de login
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
