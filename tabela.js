document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("schedule-table-body"); // Seleciona o tbody

    function generateTable() {
        tableBody.innerHTML = ''; // Limpa o conteúdo do tbody
        const monthSelect = parseInt(document.getElementById("month").value);
        const year = new Date().getFullYear(); // Ano atual - você pode alterar se necessário
        const daysInMonth = new Date(year, monthSelect, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, monthSelect - 1, day);
            const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase();
            const row = document.createElement("tr");

            if (weekday === 'SAB') {
                row.classList.add("saturday-row");
            } else if (weekday === 'DOM') {
                row.classList.add("sunday-row");
            }

            row.innerHTML = `
                <td>${date.toLocaleDateString('pt-BR')}</td>
                <td>${weekday}</td>
                <td><input type="number" class="form-control" /></td>
                <td><input type="number" class="form-control" /></td>
                <td><input type="number" class="form-control" /></td>
                <td class="total">0</td>
                <td><input type="text" class="form-control" /></td>
                <td><input type="text" class="form-control" /></td>
                <td><input type="checkbox" class="form-check-input" onchange="markHoliday(this)" /></td>
            `;
            tableBody.appendChild(row);
        }
    }

    window.markHoliday = function(checkbox) {
        const row = checkbox.closest('tr');
        if (checkbox.checked) {
            row.classList.add('holiday-row');
        } else {
            row.classList.remove('holiday-row');
            const dateCell = row.cells[0];
            const date = new Date(dateCell.textContent);
            const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase();

            if (weekday === 'SAB') {
                row.classList.add('saturday-row');
            } else if (weekday === 'DOM') {
                row.classList.add('sunday-row');
            }
        }
    };


    document.getElementById("month").addEventListener("change", generateTable);
    generateTable();
});