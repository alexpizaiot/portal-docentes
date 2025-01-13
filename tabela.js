document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("schedule-table"); // Corrigido para corresponder ao ID no HTML

    function generateTable() {
        tableBody.innerHTML = ''; // Limpa o conteúdo do tbody
        const monthSelect = parseInt(document.getElementById("month").value);
        const year = new Date().getFullYear(); // Ano atual
        const daysInMonth = new Date(year, monthSelect, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, monthSelect - 1, day);
            const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase();
            const row = document.createElement("tr");

            // Aplica classes para sábados e domingos
            if (weekday === 'SÁB.') {
                row.classList.add("saturday");
            } else if (weekday === 'DOM.') {
                row.classList.add("sunday");
            }

            row.innerHTML = `
                <td>${date.toLocaleDateString('pt-BR')}</td>
                <td>${weekday}</td>
                <td><input type="number" class="form-control" onchange="updateTotal(this)" /></td>
                <td><input type="number" class="form-control" onchange="updateTotal(this)" /></td>
                <td><input type="number" class="form-control" onchange="updateTotal(this)" /></td>
                <td class="total">0</td>
                <td><input type="text" class="form-control" /></td>
                <td><input type="text" class="form-control" /></td>
                <td><input type="checkbox" class="form-check-input" onchange="markHoliday(this)" /></td>
            `;
            tableBody.appendChild(row);
        }
    }

    // Função para marcar feriados
    window.markHoliday = function (checkbox) {
        const row = checkbox.closest('tr');
        if (checkbox.checked) {
            row.classList.add('holiday');
        } else {
            row.classList.remove('holiday');

            // Reaplica classes padrão para sábados e domingos
            const dateCell = row.cells[0];
            const date = new Date(dateCell.textContent);
            const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase();

            if (weekday === 'SÁB.') {
                row.classList.add('saturday');
            } else if (weekday === 'DOM.') {
                row.classList.add('sunday');
            }
        }
    };

    // Função para atualizar o total de horas por linha
    window.updateTotal = function (input) {
        const row = input.closest('tr');
        const cells = row.querySelectorAll('input[type="number"]');
        const totalCell = row.querySelector('.total');
        let total = 0;

        cells.forEach(cell => {
            total += parseFloat(cell.value) || 0;
        });

        totalCell.textContent = total.toFixed(1);
    };

    // Evento para regenerar a tabela ao alterar o mês
    document.getElementById("month").addEventListener("change", generateTable);
    generateTable(); // Gera a tabela inicial
});
