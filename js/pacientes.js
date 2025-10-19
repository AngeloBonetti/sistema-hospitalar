// Gerenciamento de Pacientes
class PacientesManager {
    constructor() {
        this.hospitalData = hospitalData;
        this.init();
    }

    init() {
        if (window.location.pathname.includes('pacientes.html')) {
            this.loadPacientes();
        }
        
        if (window.location.pathname.includes('cadastro-paciente.html')) {
            this.setupPacienteForm();
        }
    }

    loadPacientes() {
        const tbody = document.getElementById('pacientesTable');
        tbody.innerHTML = '';

        if (this.hospitalData.pacientes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--gray);">
                        Nenhum paciente cadastrado
                    </td>
                </tr>
            `;
            return;
        }

        this.hospitalData.pacientes.forEach(paciente => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${paciente.nome}</td>
                <td>${paciente.cpf}</td>
                <td>${paciente.telefone}</td>
                <td>${paciente.email || '-'}</td>
                <td>${paciente.tipoSanguineo || '-'}</td>
                <td>
                    <button class="btn-action" onclick="pacientesManager.viewPaciente(${paciente.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action" onclick="pacientesManager.editPaciente(${paciente.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-action" onclick="pacientesManager.deletePaciente(${paciente.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    setupPacienteForm() {
        const form = document.getElementById('formPaciente');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePacienteSubmit();
            });
        }
    }

    handlePacienteSubmit() {
        const paciente = {
            nome: document.getElementById('nome').value,
            cpf: document.getElementById('cpf').value,
            dataNascimento: document.getElementById('dataNascimento').value,
            tipoSanguineo: document.getElementById('tipoSanguineo').value,
            telefone: document.getElementById('telefone').value,
            email: document.getElementById('email').value,
            endereco: document.getElementById('endereco').value,
            alergias: document.getElementById('alergias').value,
            observacoes: document.getElementById('observacoes').value
        };

        this.hospitalData.addPaciente(paciente);
        alert('Paciente cadastrado com sucesso!');
        window.location.href = 'pacientes.html';
    }

    viewPaciente(pacienteId) {
        const paciente = this.hospitalData.pacientes.find(p => p.id === pacienteId);
        if (paciente) {
            alert(`Dados do Paciente:\n\nNome: ${paciente.nome}\nCPF: ${paciente.cpf}\nTelefone: ${paciente.telefone}\nEmail: ${paciente.email}\nTipo Sanguíneo: ${paciente.tipoSanguineo || 'Não informado'}`);
        }
    }

    editPaciente(pacienteId) {
        alert(`Editando paciente ID: ${pacienteId}\n\nFuncionalidade de edição será implementada aqui!`);
    }

    deletePaciente(pacienteId) {
        if (confirm('Tem certeza que deseja excluir este paciente?')) {
            this.hospitalData.pacientes = this.hospitalData.pacientes.filter(p => p.id !== pacienteId);
            localStorage.setItem('hospitalPacientes', JSON.stringify(this.hospitalData.pacientes));
            this.loadPacientes();
            alert('Paciente excluído com sucesso!');
        }
    }
}

// Inicializar gerenciador de pacientes
document.addEventListener('DOMContentLoaded', () => {
    window.pacientesManager = new PacientesManager();
});