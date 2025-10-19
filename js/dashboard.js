// Dashboard functionality
class Dashboard {
    constructor() {
        this.hospitalData = hospitalData;
        this.init();
    }

    init() {
        this.loadStats();
        this.loadTodayConsultas();
        this.setupEventListeners();
    }

    loadStats() {
        // Total de pacientes
        document.getElementById('totalPacientes').textContent = this.hospitalData.pacientes.length;
        
        // Consultas de hoje
        const today = new Date().toISOString().split('T')[0];
        const todayConsultas = this.hospitalData.consultas.filter(
            c => c.data === today
        );
        document.getElementById('totalConsultas').textContent = todayConsultas.length;
    }

    loadTodayConsultas() {
        const today = new Date().toISOString().split('T')[0];
        const todayConsultas = this.hospitalData.consultas.filter(
            c => c.data === today
        );

        const tbody = document.getElementById('consultasTable');
        tbody.innerHTML = '';

        if (todayConsultas.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--gray);">
                        Nenhuma consulta agendada para hoje
                    </td>
                </tr>
            `;
            return;
        }

        todayConsultas.forEach(consulta => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${consulta.pacienteNome}</td>
                <td>${consulta.medico}</td>
                <td>${consulta.hora}</td>
                <td>${consulta.tipo === 'presencial' ? 'Presencial' : 'Telemedicina'}</td>
                <td>
                    <span class="status-badge status-${consulta.status}">
                        ${this.getStatusText(consulta.status)}
                    </span>
                </td>
                <td>
                    <button class="btn-action" onclick="dashboard.viewConsulta(${consulta.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action" onclick="dashboard.editConsulta(${consulta.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    getStatusText(status) {
        const statusMap = {
            'agendado': 'Agendado',
            'realizado': 'Realizado',
            'cancelado': 'Cancelado'
        };
        return statusMap[status] || status;
    }

    viewConsulta(consultaId) {
        const consulta = this.hospitalData.consultas.find(c => c.id === consultaId);
        if (consulta) {
            alert(`Detalhes da Consulta:\n\nPaciente: ${consulta.pacienteNome}\nMédico: ${consulta.medico}\nData: ${consulta.data}\nHora: ${consulta.hora}\nStatus: ${this.getStatusText(consulta.status)}`);
        }
    }

    editConsulta(consultaId) {
        // Implementar edição de consulta
        alert('Funcionalidade de edição será implementada aqui!');
    }

    setupEventListeners() {
        // Adicionar event listeners se necessário
    }
}

// Inicializar dashboard quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});