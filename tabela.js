document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("schedule-table");

    // Função para gerar a tabela de horários
    function generateTable() {
        tableBody.innerHTML = ''; // Limpar a tabela antes de recriar
        const monthSelect = parseInt(document.getElementById("month").value);
        const year = 2025; // Você pode querer tornar isso dinâmico
        const daysInMonth = new Date(year, monthSelect, 0).getDate();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, monthSelect - 1, day);
            const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase();

            // Criar uma linha para cada dia
            const row = document.createElement("tr");

            // Aplicar classes de estilo com base no dia da semana ANTES de adicionar a classe de feriado
            if (weekday === 'SAB') {
                row.classList.add("saturday-row");
            } else if (weekday === 'DOM') { // Use else if para evitar adicionar as duas classes
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

    // Função para marcar feriados
    window.markHoliday = function(checkbox) {
        const row = checkbox.closest('tr');
        if (checkbox.checked) {
            row.classList.add('holiday-row'); // Adiciona a classe de feriado, que tem !important e sobrescreve as outras
        } else {
            row.classList.remove('holiday-row');

             // Reaplicar a classe de sábado/domingo se necessário
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

    // Atualizar tabela ao mudar o mês
    document.getElementById("month").addEventListener("change", generateTable);

    // Geração inicial da tabela para o mês atual
    generateTable();
});