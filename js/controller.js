// Objeto Controller responsável pela lógica de negócio (camada intermediária do MVC)
// Intermedia as requisições entre a View (interface) e o Model (banco de dados)
const Controller = {

    // Calcula a média aritmética de 4 notas e retorna o valor com 2 casas decimais
    calcularMedia(n1, n2, n3, n4) {
        return parseFloat(((n1 + n2 + n3 + n4) / 4).toFixed(2));
    },

    // Define o status do aluno com base na média: Aprovado (>= 6.0) ou Reprovado
    definirStatus(media) {
        return media >= 6.0 ? 'Aprovado' : 'Reprovado';
    },

    // Busca todos os alunos no banco (via Model) e repassa à View para renderização
    async carregarAlunos() {
        try {
            const dados = await Model.buscarTodos(); // Requisição assíncrona ao banco

            // Valida se a resposta é um array; caso contrário, exibe erro na View
            if (!Array.isArray(dados)) {
                console.error('Resposta inesperada do Banco', dados);
                View.mostrarMensagem('Erro ao carregar os dados', 'erro');
                return;
            }

            View.renderizarLista(dados); // Envia os dados para a View montar os cards na tela

        } catch (error) {
            // Captura erros de rede/conexão e notifica o usuário
            console.error('Erro na conexão', error);
            View.mostrarMensagem('Sem conexão com o banco', 'erro');
        }
    },

    // Obtém os dados do formulário, calcula média/status e persiste no banco via Model
    async salvar(evento) {
        evento.preventDefault(); // Impede o recarregamento da página ao submeter o formulário

        // Desestrutura o retorno do formulário em variáveis individuais
        const [nome, nota1, nota2, nota3, nota4] = View.obterDadosFormulario();

        // Validação básica: nome é obrigatório
        if (!nome) {
            View.mostrarMensagem('Informe o nome do Aluno', 'erro');
            return;
        }

        // Calcula média e status com base nas notas informadas
        const media = this.calcularMedia({ nota1, nota2, nota3, nota4 });
        const status = this.definirStatus(media);

        View.mostrarMensagem('Salvando no banco de dados...');

        try {
            // Tenta salvar os dados no Supabase via Model
            const sucesso = await Model.salvar({ nome, nota1, nota2, nota3, nota4, media, status });

            if (sucesso) {
                // Em caso de sucesso: notifica o usuário, recarrega a lista e limpa o formulário
                View.mostrarMensagem(`Salvo! Média: ${media} - ${status}`, 'sucesso');
                this.carregarAlunos();
                View.limparFormulario();
            }
        } catch (error) {
            console.error('Erro ao calcular a média', error);
            View.mostrarMensagem('Erro ao calcular a média', 'erro');
            return;
        }
    },

    // Exclui um registro do banco pelo ID, após confirmação do usuário
    async excluir(id) {
        // Exibe diálogo de confirmação; se cancelado, a condição é false e a função continua (BUG: falta return)
        if (!confirm('Tem certeza que deseja apagar este registro?'))

            try {
                const sucesso = await Model.excluir(id); // Requisição DELETE ao banco

                if (sucesso) {
                    this.carregarAlunos(); // Recarrega a lista se a exclusão foi bem-sucedida
                } else {
                    View.mostrarMensagem('Não foi possível excluir o registro');
                }
            } catch (error) {
                console.error('Erro ao excluir: ', error);
                View.mostrarMensagem('Erro ao excluir o registro', 'erro');
            }
    },

    // Método de inicialização: registra os event listeners e faz a carga inicial dos dados
    init() {
        // Escuta o evento de submit do formulário (chamando salvar)
        View.el.form.addEventListener('submit', (e) => this.salvar(e));

        // Escuta o clique no botão "Limpar Campos" para resetar o formulário
        document.querySelector('#btnLimpar').addEventListener('click', () => View.limparFormulario());

        // Carga inicial: carrega e exibe todos os alunos salvos ao abrir a página
        this.carregarAlunos();
    }
};

// Inicializa a aplicação assim que o script é carregado
Controller.init();