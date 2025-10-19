// Gerenciamento de Consultas
class ConsultasManager {
    constructor() {
        this.hospitalData = hospitalData;
        this.init();
    }

    init() {
        if (window.location.pathname.includes('consultas.html')) {
            this.loadConsultas();
            this.setupFilterEvents();
        }
        
        if (window.location.pathname.includes('agendar-consulta.html')) {
            this.setupConsultaForm();
            this.loadPacientesSelect();
        }
    }

    loadConsultas() {
        this.displayConsultas(this.hospitalData.consultas);
    }

    loadPacientesSelect() {
        const select = document.getElementById('paciente');
        select.innerHTML = '<option value="">Selecione um paciente</option>';
        
        this.hospitalData.pacientes.forEach(paciente => {
            const option = document.createElement('option');
            option.value = paciente.id;
            option.textContent = paciente.nome;
            select.appendChild(option);
        });
    }

    setupConsultaForm() {
        const form = document.getElementById('formConsulta');
        if (form) {
            // Definir data mínima como hoje
            document.getElementById('data').min = new Date().toISOString().split('T')[0];
            
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleConsultaSubmit();
            });
        }
    }

    setupFilterEvents() {
        // Aplicar filtros ao mudar valores
        document.getElementById('filterStatus').addEventListener('change', () => {
            this.applyFilters();
        });
        
        document.getElementById('filterDate').addEventListener('change', () => {
            this.applyFilters();
        });
        
        document.getElementById('filterType').addEventListener('change', () => {
            this.applyFilters();
        });
    }

    handleConsultaSubmit() {
        const pacienteSelect = document.getElementById('paciente');
        const pacienteId = parseInt(pacienteSelect.value);
        const paciente = this.hospitalData.pacientes.find(p => p.id === pacienteId);

        if (!paciente) {
            alert('Selecione um paciente válido!');
            return;
        }

        const consulta = {
            pacienteId: pacienteId,
            pacienteNome: paciente.nome,
            medico: document.getElementById('medico').value,
            especialidade: document.getElementById('especialidade').value,
            data: document.getElementById('data').value,
            hora: document.getElementById('hora').value,
            tipo: document.getElementById('tipo').value,
            observacoes: document.getElementById('observacoes').value,
            status: 'agendado'
        };

        this.hospitalData.addConsulta(consulta);
        alert('Consulta agendada com sucesso!');
        window.location.href = 'consultas.html';
    }

    applyFilters() {
        const statusFilter = document.getElementById('filterStatus').value;
        const dateFilter = document.getElementById('filterDate').value;
        const typeFilter = document.getElementById('filterType').value;

        let filteredConsultas = this.hospitalData.consultas;

        // Filtro por status
        if (statusFilter) {
            filteredConsultas = filteredConsultas.filter(c => c.status === statusFilter);
        }

        // Filtro por data
        if (dateFilter) {
            filteredConsultas = filteredConsultas.filter(c => c.data === dateFilter);
        }

        // Filtro por tipo
        if (typeFilter) {
            filteredConsultas = filteredConsultas.filter(c => c.tipo === typeFilter);
        }

        // Mostrar resultado
        this.displayConsultas(filteredConsultas);
    }

    displayConsultas(consultas) {
        const tbody = document.getElementById('consultasTable');
        tbody.innerHTML = '';

        if (consultas.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: var(--gray);">
                        Nenhuma consulta encontrada
                    </td>
                </tr>
            `;
            return;
        }

        // Ordenar consultas por data (mais recentes primeiro)
        const consultasOrdenadas = consultas.sort((a, b) => 
            new Date(b.data + ' ' + b.hora) - new Date(a.data + ' ' + a.hora)
        );

        consultasOrdenadas.forEach(consulta => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${consulta.pacienteNome}</td>
                <td>${consulta.medico}</td>
                <td>${this.formatDate(consulta.data)}</td>
                <td>${consulta.hora}</td>
                <td>${consulta.tipo === 'presencial' ? 'Presencial' : 'Telemedicina'}</td>
                <td>
                    <span class="status-badge status-${consulta.status}">
                        ${this.getStatusText(consulta.status)}
                    </span>
                </td>
                <td>
                    <button class="btn-action" onclick="consultasManager.viewConsulta(${consulta.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action" onclick="consultasManager.editConsulta(${consulta.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action" onclick="consultasManager.cancelConsulta(${consulta.id})">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    viewConsulta(consultaId) {
        const consulta = this.hospitalData.consultas.find(c => c.id === consultaId);
        if (consulta) {
            alert(`Detalhes da Consulta:\n\nPaciente: ${consulta.pacienteNome}\nMédico: ${consulta.medico}\nData: ${this.formatDate(consulta.data)}\nHora: ${consulta.hora}\nTipo: ${consulta.tipo === 'presencial' ? 'Presencial' : 'Telemedicina'}\nStatus: ${this.getStatusText(consulta.status)}`);
        }
    }

    editConsulta(consultaId) {
        alert(`Editando consulta ID: ${consultaId}\n\nFuncionalidade de edição será implementada aqui!`);
    }

    cancelConsulta(consultaId) {
        if (confirm('Tem certeza que deseja cancelar esta consulta?')) {
            const consulta = this.hospitalData.consultas.find(c => c.id === consultaId);
            if (consulta) {
                consulta.status = 'cancelado';
                localStorage.setItem('hospitalConsultas', JSON.stringify(this.hospitalData.consultas));
                this.loadConsultas();
                alert('Consulta cancelada com sucesso!');
            }
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    getStatusText(status) {
        const statusMap = {
            'agendado': 'Agendado',
            'realizado': 'Realizado',
            'cancelado': 'Cancelado'
        };
        return statusMap[status] || status;
    }
}

// Inicializar gerenciador de consultas
document.addEventListener('DOMContentLoaded', () => {
    window.consultasManager = new ConsultasManager();
});