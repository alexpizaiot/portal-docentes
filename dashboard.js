import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

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
            initializeDashboard(user);
        }
    });
});

function initializeDashboard(user) {
    const usuariosMenuItem = document.getElementById("usuariosMenuItem");
    const cadastroHorariosMenuItem = document.getElementById("cadastroHorariosMenuItem");
    const usuariosSection = document.getElementById("usuariosSection");
    const horariosSection = document.getElementById("horariosSection");
    const tableBody = document.getElementById("schedule-table");
    const menuButton = document.getElementById("menuButton");
    const sidebar = document.getElementById("sidebar");

    // Controle do menu para nível gestor
    const userLevel = new URLSearchParams(window.location.search).get("nivel");
    if (userLevel === "gestor") {
        usuariosMenuItem.classList.remove("d-none");
        cadastroHorariosMenuItem.classList.remove("d-none");

        cadastroHorariosMenuItem.addEventListener("click", () => {
            horariosSection.classList.remove("d-none");
            usuariosSection.classList.add("d-none");
            loadHorarios(); // Carregar a tabela de horários
        });
    }

    // Função para carregar dados de horários
    async function loadHorarios() {
        tableBody.innerHTML = ""; // Limpar tabela existente
        const monthSelect = document.getElementById("month");
        const docenteSelect = document.getElementById("docente");
        const selectedMonth = parseInt(monthSelect.value, 10);
        const selectedDocente = docenteSelect.value;

        const daysInMonth = new Date(2025, selectedMonth, 0).getDate();
        const weekdays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(2025, selectedMonth - 1, day);
            const weekday = weekdays[date.getDay()];

            const row = document.createElement("tr");
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

        document.getElementById("total-month").textContent = `Total mensal: 0 horas`;
    }

    // Função para marcar feriados
    window.markHoliday = function (checkbox) {
        const row = checkbox.closest("tr");
        if (checkbox.checked) {
            row.classList.add("holiday-row");
        } else {
            row.classList.remove("holiday-row");
        }
    };

    // Função para atualizar o total mensal
    window.updateMonthlyTotal = function () {
        const rows = tableBody.querySelectorAll("tr");
        let monthlyTotal = 0;

        rows.forEach((row) => {
            const inputs = row.querySelectorAll("input[type='number']");
            const totalCell = row.querySelector(".total");
            let dailyTotal = 0;

            inputs.forEach((input) => {
                dailyTotal += parseFloat(input.value) || 0;
            });

            totalCell.textContent = dailyTotal.toFixed(1);
            monthlyTotal += dailyTotal;
        });

        document.getElementById("total-month").textContent = `Total mensal: ${monthlyTotal.toFixed(1)} horas`;
    };

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        try {
            await signOut(auth);
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
