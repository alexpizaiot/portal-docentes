import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD9cXBzN-b5z-390MWcmIpTjuNyKhWXhCo",
    authDomain: "portaldocentes-fb404.firebaseapp.com",
    projectId: "portaldocentes-fb404",
    storageBucket: "portaldocentes-fb404.firebaseapp.com",
    messagingSenderId: "837457806876",
    appId: "1:837457806876:web:c2d8104e26c2ad96d041d9"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    // Verificar autenticação do usuário
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            // Redirecionar para a página de login se não autenticado
            window.location.href = 'index.html';
        } else {
            console.log("Usuário autenticado:", user.email);
            initializeDashboard(user);
        }
    });
});

function initializeDashboard(user) {
    const gestorMenuItem = document.getElementById("gestorMenuItem");
    const gestorSection = document.getElementById("gestorSection");
    const addUserForm = document.getElementById("addUserForm");
    const emailInput = document.getElementById("emailInput");
    const levelSelect = document.getElementById("levelSelect");
    const userList = document.getElementById("userList");
    const menuButton = document.getElementById("menuButton");
    const sidebar = document.getElementById("sidebar");

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

        // Alternar entre abas
        document.getElementById("cadastro-tab").addEventListener("click", () => {
            document.getElementById("cadastro").classList.add("show", "active");
            document.getElementById("usuarios").classList.remove("show", "active");
            document.getElementById("horarios").classList.remove("show", "active");
        });

        document.getElementById("usuarios-tab").addEventListener("click", () => {
            document.getElementById("usuarios").classList.add("show", "active");
            document.getElementById("cadastro").classList.remove("show", "active");
            document.getElementById("horarios").classList.remove("show", "active");
            loadUsers();
        });

        document.getElementById("horarios-tab").addEventListener("click", () => {
            document.getElementById("horarios").classList.add("show", "active");
            document.getElementById("cadastro").classList.remove("show", "active");
            document.getElementById("usuarios").classList.remove("show", "active");
            loadHorarios();
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

    // Função para carregar dados de horários
    async function loadHorarios() {
        const tableBody = document.getElementById("schedule-table");
        const monthSelect = document.getElementById("month");
        tableBody.innerHTML = ""; // Limpar tabela existente

        const month = monthSelect.value - 1; // Ajustar para índice do JavaScript (0-11)
        const year = new Date().getFullYear();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const weekdays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const weekday = weekdays[date.getDay()];

            const row = document.createElement("tr");

            // Adicionar classes com base no dia
            if (weekday === "SAB") {
                row.classList.add("saturday-row");
            } else if (weekday === "DOM") {
                row.classList.add("sunday-row");
            }

            row.innerHTML = `
                <td>${date.toLocaleDateString("pt-BR")}</td>
                <td>${weekday}</td>
                <td><input type="number" class="form-control" step="0.1" min="0" onchange="updateMonthlyTotal()"></td>
                <td><input type="number" class="form-control" step="0.1" min="0" onchange="updateMonthlyTotal()"></td>
                <td><input type="number" class="form-control" step="0.1" min="0" onchange="updateMonthlyTotal()"></td>
                <td class="total">0</td>
                <td><input type="text" class="form-control"></td>
                <td><input type="text" class="form-control"></td>
                <td><input type="checkbox" class="form-check-input" onchange="markHoliday(this)"></td>
            `;

            tableBody.appendChild(row);
        }

        updateMonthlyTotal();
    }

    // Função para marcar feriado
    function markHoliday(checkbox) {
        const row = checkbox.closest("tr");
        if (checkbox.checked) {
            row.classList.add("holiday-row");
        } else {
            row.classList.remove("holiday-row");
        }
    }

    // Função para atualizar o total mensal
    function updateMonthlyTotal() {
        const totalCells = document.querySelectorAll(".total");
        const tableBody = document.getElementById("schedule-table");
        const rows = tableBody.querySelectorAll("tr");
        let monthlyTotal = 0;

        rows.forEach(row => {
            const inputs = row.querySelectorAll("input[type='number']");
            const totalCell = row.querySelector(".total");
            let dailyTotal = 0;

            inputs.forEach(input => {
                dailyTotal += parseFloat(input.value) || 0;
            });

            totalCell.textContent = dailyTotal.toFixed(1);
            monthlyTotal += dailyTotal;
        });

        document.getElementById("total-month").textContent = `Total mensal: ${monthlyTotal.toFixed(1)} horas`;
    }

    // Controle do menu hambúrguer
    menuButton.addEventListener("click", () => {
        sidebar.classList.toggle("active");
    });

    document.addEventListener("click", (event) => {
        if (!sidebar.contains(event.target) && !menuButton.contains(event.target)) {
            sidebar.classList.remove("active");
        }
    });

    // Listener para o dropdown de mês
    const monthSelect = document.getElementById("month");
    monthSelect.addEventListener("change", loadHorarios);
}
