document.addEventListener("DOMContentLoaded", () => {
    const monthSelect = document.getElementById("month");
    const tableBody = document.getElementById("schedule-table");

    // Gerar tabela ao carregar a página ou ao mudar o mês
    monthSelect.addEventListener("change", generateTable);
    generateTable(); // Gera a tabela inicial

    function generateTable() {
        const month = monthSelect.value - 1; // Mês indexado de 0 a 11
        const year = new Date().getFullYear();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const weekdays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

        tableBody.innerHTML = ""; // Limpar tabela existente

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const weekday = weekdays[date.getDay()];

            const row = document.createElement("tr");

            // Estilizar linhas para sábado, domingo e feriados
            if (weekday === "SAB") {
                row.classList.add("saturday-row");
            } else if (weekday === "DOM") {
                row.classList.add("sunday-row");
            }

            row.innerHTML = `
                <td>${date.toLocaleDateString("pt-BR")}</td>
                <td>${weekday}</td>
                <td><input type="number" class="form-control" step="0.1" min="0" onchange="updateDailyTotal(this)"></td>
                <td><input type="number" class="form-control" step="0.1" min="0" onchange="updateDailyTotal(this)"></td>
                <td><input type="number" class="form-control" step="0.1" min="0" onchange="updateDailyTotal(this)"></td>
                <td class="total">0.0</td>
                <td><input type="text" class="form-control"></td>
                <td><input type="text" class="form-control"></td>
                <td><input type="checkbox" class="form-check-input" onchange="markHoliday(this)"></td>
            `;
            tableBody.appendChild(row);
        }

        updateMonthlyTotal(); // Atualizar total mensal
    }

    // Atualizar total diário
    window.updateDailyTotal = function (input) {
        const row = input.closest("tr");
        const inputs = row.querySelectorAll("input[type='number']");
        const totalCell = row.querySelector(".total");
        let dailyTotal = 0;

        inputs.forEach(input => {
            dailyTotal += parseFloat(input.value) || 0;
        });

        totalCell.textContent = dailyTotal.toFixed(1);
        updateMonthlyTotal(); // Atualizar o total mensal
    };

    // Marcar feriado
    window.markHoliday = function (checkbox) {
        const row = checkbox.closest("tr");
        if (checkbox.checked) {
            row.classList.add("holiday-row");
        } else {
            row.classList.remove("holiday-row");
        }
    };

    // Atualizar total mensal
    function updateMonthlyTotal() {
        const totalCells = document.querySelectorAll(".total");
        let monthlyTotal = 0;

        totalCells.forEach(cell => {
            monthlyTotal += parseFloat(cell.textContent) || 0;
        });

        document.getElementById("total-month").textContent = `Total mensal: ${monthlyTotal.toFixed(1)} horas`;
    }
});
