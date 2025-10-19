// Sistema de autenticação e dados iniciais
class AuthSystem {
    constructor() {
        this.users = this.getUsers();
        this.init();
    }

    init() {
        // Criar usuários padrão se não existirem
        if (!this.users || this.users.length === 0) {
            this.createDefaultUsers();
        }

        // Verificar se já está logado
        this.checkLoginStatus();
        
        // Configurar formulário de login
        this.setupLoginForm();
    }

    getUsers() {
        return JSON.parse(localStorage.getItem('hospitalUsers')) || [];
    }

    createDefaultUsers() {
        const defaultUsers = [
            {
                id: 1,
                username: 'admin',
                password: 'senha123',
                nome: 'Administrador Sistema',
                tipo: 'admin',
                email: 'admin@vidaplus.com'
            },
            {
                id: 2,
                username: 'medico',
                password: 'senha123',
                nome: 'Dr. João Silva',
                tipo: 'medico',
                especialidade: 'Cardiologia',
                email: 'joao.silva@vidaplus.com'
            }
        ];
        
        localStorage.setItem('hospitalUsers', JSON.stringify(defaultUsers));
        this.users = defaultUsers;
    }

    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
    }

    handleLogin() {
        const username = document.getElementById('usuario').value;
        const password = document.getElementById('senha').value;

        const user = this.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // Salvar sessão
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Redirecionar para dashboard
            window.location.href = 'dashboard.html';
        } else {
            alert('Usuário ou senha inválidos!');
        }
    }

    checkLoginStatus() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const currentPage = window.location.pathname.split('/').pop();
        
        if (currentUser && currentPage === 'index.html') {
            window.location.href = 'dashboard.html';
        } else if (!currentUser && currentPage !== 'index.html') {
            window.location.href = 'index.html';
        }
    }

    logout() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Inicializar sistema de autenticação
const auth = new AuthSystem();

// Dados iniciais do sistema
class HospitalData {
    constructor() {
        this.pacientes = this.getPacientes();
        this.consultas = this.getConsultas();
        this.initData();
    }

    initData() {
        if (!this.pacientes || this.pacientes.length === 0) {
            this.createSamplePacientes();
        }
        if (!this.consultas || this.consultas.length === 0) {
            this.createSampleConsultas();
        }
    }

    getPacientes() {
        return JSON.parse(localStorage.getItem('hospitalPacientes')) || [];
    }

    getConsultas() {
        return JSON.parse(localStorage.getItem('hospitalConsultas')) || [];
    }

    createSamplePacientes() {
        const samplePacientes = [
            {
                id: 1,
                nome: 'Maria Santos',
                cpf: '123.456.789-00',
                dataNascimento: '1985-03-15',
                telefone: '(11) 99999-9999',
                email: 'maria.santos@email.com',
                endereco: 'Rua das Flores, 123 - São Paulo/SP',
                tipoSanguineo: 'A+',
                alergias: 'Penicilina',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                nome: 'José Oliveira',
                cpf: '987.654.321-00',
                dataNascimento: '1978-07-22',
                telefone: '(11) 88888-8888',
                email: 'jose.oliveira@email.com',
                endereco: 'Av. Paulista, 1000 - São Paulo/SP',
                tipoSanguineo: 'O-',
                alergias: 'Nenhuma',
                createdAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('hospitalPacientes', JSON.stringify(samplePacientes));
        this.pacientes = samplePacientes;
    }

    createSampleConsultas() {
        const sampleConsultas = [
            {
                id: 1,
                pacienteId: 1,
                pacienteNome: 'Maria Santos',
                medico: 'Dr. João Silva',
                especialidade: 'Cardiologia',
                data: '2024-03-20',
                hora: '14:30',
                status: 'agendado',
                tipo: 'presencial',
                observacoes: 'Consulta de rotina',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                pacienteId: 2,
                pacienteNome: 'José Oliveira',
                medico: 'Dra. Ana Costa',
                especialidade: 'Clínico Geral',
                data: '2024-03-18',
                hora: '10:00',
                status: 'realizado',
                tipo: 'telemedicina',
                observacoes: 'Paciente com queixa de dor de cabeça',
                createdAt: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('hospitalConsultas', JSON.stringify(sampleConsultas));
        this.consultas = sampleConsultas;
    }

    addPaciente(paciente) {
        paciente.id = Date.now();
        paciente.createdAt = new Date().toISOString();
        this.pacientes.push(paciente);
        localStorage.setItem('hospitalPacientes', JSON.stringify(this.pacientes));
        return paciente;
    }

    addConsulta(consulta) {
        consulta.id = Date.now();
        consulta.createdAt = new Date().toISOString();
        this.consultas.push(consulta);
        localStorage.setItem('hospitalConsultas', JSON.stringify(this.consultas));
        return consulta;
    }
}

// Inicializar dados do hospital
const hospitalData = new HospitalData();