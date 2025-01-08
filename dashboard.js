import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    const gestorMenuItem = document.getElementById("gestorMenuItem");
    const gestorSection = document.getElementById("gestorSection");
    const cadastroTab = document.getElementById("cadastroTab");
    const usuariosTab = document.getElementById("usuariosTab");
    const cadastroSection = document.getElementById("cadastroSection");
    const usuariosSection = document.getElementById("usuariosSection");

    // Verificar o estado de autenticação do usuário
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("Usuário autenticado:", user.email);

            // Consultar o nível do usuário
            const querySnapshot = await getDocs(collection(db, "autorizados"));
            let userLevel = null;

            querySnapshot.forEach((doc) => {
                if (doc.data().email === user.email) {
                    userLevel = doc.data().nivel;
                }
            });

            if (!userLevel) {
                alert("Acesso negado. Seu e-mail não está autorizado.");
                await signOut(auth);
                window.location.href = "index.html";
                return;
            }

            // Verificar se é gestor e exibir as opções correspondentes
            if (userLevel === "gestor") {
                if (gestorMenuItem) gestorMenuItem.classList.remove("d-none");

                gestorMenuItem.addEventListener("click", () => {
                    if (gestorSection) gestorSection.classList.remove("d-none");
                });

                // Alternar entre as abas
                cadastroTab.addEventListener("click", (e) => {
                    e.preventDefault();
                    cadastroTab.classList.add("active");
                    usuariosTab.classList.remove("active");
                    cadastroSection.classList.remove("d-none");
                    usuariosSection.classList.add("d-none");
                });

                usuariosTab.addEventListener("click", (e) => {
                    e.preventDefault();
                    usuariosTab.classList.add("active");
                    cadastroTab.classList.remove("active");
                    cadastroSection.classList.add("d-none");
                    usuariosSection.classList.remove("d-none");
                    loadUsers();
                });

                // Função para carregar usuários cadastrados
                async function loadUsers() {
                    try {
                        const querySnapshot = await getDocs(collection(db, "autorizados"));
                        const userList = document.getElementById("userList");
                        userList.innerHTML = "";

                        querySnapshot.forEach((doc) => {
                            const userData = doc.data();
                            const userItem = document.createElement("div");
                            userItem.innerHTML = `
                                E-mail: ${userData.email} | Nível: ${userData.nivel}
                                <button class="btn btn-warning btn-sm mx-2" data-id="${doc.id}" data-email="${userData.email}" data-nivel="${userData.nivel}">Editar</button>
                                <button class="btn btn-danger btn-sm" data-id="${doc.id}">Excluir</button>
                            `;
                            userList.appendChild(userItem);
                        });

                        // Adicionar eventos aos botões de edição e exclusão
                        document.querySelectorAll(".btn-warning").forEach((btn) => {
                            btn.addEventListener("click", (e) => {
                                const id = e.target.getAttribute("data-id");
                                const email = e.target.getAttribute("data-email");
                                const nivel = e.target.getAttribute("data-nivel");

                                document.getElementById("emailInput").value = email;
                                document.getElementById("levelSelect").value = nivel;
                                document.getElementById("addUserForm").setAttribute("data-id", id);
                            });
                        });

                        document.querySelectorAll(".btn-danger").forEach((btn) => {
                            btn.addEventListener("click", async (e) => {
                                const id = e.target.getAttribute("data-id");
                                try {
                                    await deleteDoc(doc(db, "autorizados", id));
                                    alert("Usuário excluído com sucesso!");
                                    loadUsers();
                                } catch (error) {
                                    console.error("Erro ao excluir usuário:", error);
                                }
                            });
                        });
                    } catch (error) {
                        console.error("Erro ao carregar usuários:", error);
                    }
                }

                // Lógica para gravar ou atualizar os dados no Firestore
                const addUserForm = document.getElementById("addUserForm");
                if (addUserForm) {
                    addUserForm.addEventListener("submit", async (e) => {
                        e.preventDefault();
                        const email = document.getElementById("emailInput").value.trim();
                        const nivel = document.getElementById("levelSelect").value;
                        const id = addUserForm.getAttribute("data-id");

                        try {
                            if (id) {
                                // Atualizar usuário existente
                                await updateDoc(doc(db, "autorizados", id), { email, nivel });
                                alert("Usuário atualizado com sucesso!");
                                addUserForm.removeAttribute("data-id");
                            } else {
                                // Adicionar novo usuário
                                await addDoc(collection(db, "autorizados"), { email, nivel });
                                alert("Usuário adicionado com sucesso!");
                            }
                            addUserForm.reset();
                            loadUsers();
                        } catch (error) {
                            console.error("Erro ao salvar no Firestore:", error);
                        }
                    });
                }
            }
        } else {
            // Redirecionar para login se não estiver autenticado
            window.location.href = "index.html";
        }
    });
});
