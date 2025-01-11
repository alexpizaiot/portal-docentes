document.addEventListener("DOMContentLoaded", () => {
    generateTable();

    // Adicionar evento para gerar tabela ao alterar o mês selecionado
    const monthSelect = document.getElementById("month");
    monthSelect.addEventListener("change", generateTable);

    // Função para gerar a tabela de horários
    function generateTable() {
        const month = monthSelect.value;
        const tableBody = document.getElementById("schedule-table");
        tableBody.innerHTML = ""; // Limpar tabela existente

        const daysInMonth = new Date(new Date().getFullYear(), month, 0).getDate();
        const weekdays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(new Date().getFullYear(), month - 1, day);
            const weekday = weekdays[date.getDay()];

            const row = document.createElement("tr");

            // Adicionar classes com base no dia da semana
            if (weekday === "SAB") {
                row.classList.add("saturday-row");
            } else if (weekday === "DOM") {
                row.classList.add("sunday-row");
            }

            row.innerHTML = `
                <td>${date.toLocaleDateString("pt-BR")}</td>
                <td>${weekday}</td>
                <td><input type="number" step="0.1" min="0" onchange="updateDailyTotal(this)"></td>
                <td><input type="number" step="0.1" min="0" onchange="updateDailyTotal(this)"></td>
                <td><input type="number" step="0.1" min="0" onchange="updateDailyTotal(this)"></td>
                <td class="total">0.0</td>
                <td><input type="text"></td>
                <td><input type="text"></td>
                <td><input type="checkbox" onchange="markHoliday(this)"></td>
            `;

            tableBody.appendChild(row);
        }

        updateMonthlyTotal(); // Atualizar o total mensal após criar a tabela
    }

    // Função para atualizar o total diário de cada linha
    window.updateDailyTotal = function (input) {
        const row = input.closest("tr");
        const inputs = row.querySelectorAll("input[type='number']");
        const totalCell = row.querySelector(".total");
        let dailyTotal = 0;

        inputs.forEach(input => {
            dailyTotal += parseFloat(input.value) || 0;
        });

        totalCell.textContent = dailyTotal.toFixed(1);
        updateMonthlyTotal(); // Recalcular o total mensal
    };

    // Função para marcar ou desmarcar feriados
    window.markHoliday = function (checkbox) {
        const row = checkbox.closest("tr");
        if (checkbox.checked) {
            row.classList.add("holiday-row");
        } else {
            row.classList.remove("holiday-row");
        }
    };

    // Função para atualizar o total mensal
    function updateMonthlyTotal() {
        const totalCells = document.querySelectorAll(".total");
        let monthlyTotal = 0;

        totalCells.forEach(cell => {
            monthlyTotal += parseFloat(cell.textContent) || 0;
        });

        document.getElementById("total-month").textContent = `Total mensal: ${monthlyTotal.toFixed(1)} horas`;
    }
});
