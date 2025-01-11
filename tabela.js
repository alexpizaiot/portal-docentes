document.addEventListener("DOMContentLoaded", () => {
    const horariosSection = document.getElementById("horariosSection");
    const tableBody = document.getElementById("schedule-table");

    function generateTable() {
        tableBody.innerHTML = ''; // Limpar a tabela antes de recriar
        const monthSelect = document.getElementById("month").value;
        const daysInMonth = new Date(2025, monthSelect, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(2025, monthSelect - 1, day);
            const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase();

            const row = document.createElement("tr");
            if (weekday === 'SAB') row.classList.add("saturday-row");
            if (weekday === 'DOM') row.classList.add("sunday-row");

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

    function markHoliday(checkbox) {
        const row = checkbox.closest('tr');
        if (checkbox.checked) {
            row.classList.add('holiday-row');
        } else {
            row.classList.remove('holiday-row');
        }
    }

    document.getElementById("month").addEventListener("change", generateTable);
    generateTable();
});
