// Objeto View responsável pela interface do usuário (camada de apresentação do MVC)
const View = {

    // Mapeamento dos elementos do DOM utilizados pela View
    el: {
        form: document.querySelector("#meuForm"),         // Formulário principal
        nome: document.querySelector("#nome"),            // Campo de nome do aluno
        nota1: document.querySelector("#nota1"),          // Campo da primeira nota
        nota2: document.querySelector("#nota2"),          // Campo da segunda nota
        nota3: document.querySelector("#nota3"),          // Campo da terceira nota
        nota4: document.querySelector("#nota4"),          // Campo da quarta nota
        status: document.querySelector("#status"),        // Elemento de exibição de status
        listaAlunos: document.querySelector("#listaAlunos") // Container onde os cards dos alunos são renderizados
    },

    // Coleta os valores brutos dos campos do formulário e os retorna como objeto
    // A view apenas captura os dados; quem processa e valida é o Controller
    obterDadosFormulario() {
        return {
                nome: this.el.nome.value,                       // Nome do aluno (string)
                nota1: parseFloat(this.el.nota1.value) || 0,    // Nota 1 convertida para número (0 se inválido)
                nota2: parseFloat(this.el.nota2.value) || 0,    // Nota 2 convertida para número (0 se inválido)
                nota3: parseFloat(this.el.nota3.value) || 0,    // Nota 3 convertida para número (0 se inválido)
                nota4: parseFloat(this.el.nota4.value) || 0     // Nota 4 convertida para número (0 se inválido)
            };
        },

        // Renderiza a lista de alunos na tela, criando cards dinâmicos para cada um
        renderizarAlunos(alunos) {
            this.el.listaAlunos.innerHTML = ''; // Limpa o conteúdo anterior do container

            // Exibe mensagem padrão caso não haja nenhum aluno cadastrado
            if (alunos.length === 0) {
                this.el.listaAlunos.innerHTML = '<p class="sem-registroa">Nenhum registro encontrado.</p>';
                return;
            }

            // Percorre o array de alunos e cria um card visual para cada um
            alunos.forEach(aluno => {
                const card = document.createElement('div');   // Cria o elemento div do card
                card.className = 'aluno-card';                // Aplica a classe CSS para estilização
                const corStatus = aluno.status === 'Aprovado' ? 'verde' : 'vermelho'; // Define a cor conforme o status

                // Monta o HTML interno do card com as informações do aluno
                card.innerHTML = `
                    <div class="aluno-info">

                    <strong>${aluno.nome}</strong>  <!-- Nome do aluno em destaque -->

                    <span class="nota-inline">       <!-- Exibe as 4 notas lado a lado -->
                        n1: ${aluno.nota1} &nbsp;|&nbsp; 
                        n2: ${aluno.nota2} &nbsp;|&nbsp; 
                        n3: ${aluno.nota3} &nbsp;|&nbsp; 
                        n4: ${aluno.nota4}
                    </span>

                    <span>                           <!-- Exibe a média calculada com 2 casas decimais -->
                        Média: <strong>${parseFloat(aluno.media).toFixed(2)}</strong>
                        <span class="badge-status" style="background-color: ${corStatus};">  <!-- Badge colorido conforme status -->
                        ${aluno.status}
                        </span>
                    </span>

                    </div>

                    <!-- Botão que chama o Controller para excluir o aluno pelo ID -->
                    <button class="btn-excluir" onclick="Controller.excluir(${aluno.id})">Excluir</button>
                `;
                this.el.listaAlunos.appendChild(card); // Adiciona o card ao container da lista
        });

    },

    // Exibe uma mensagem na interface com cor tipada (normal, sucesso ou erro)
    mostrarMensagem(mensagem, tipo = 'info') {
    
        // Mapa de cores conforme o tipo da mensagem
        const cores = {
            normal: '#1e3c75',   // Azul escuro para mensagens informativas
            sucesso: '#28a745',  // Verde para operações bem-sucedidas
            erro: '#dc3545'      // Vermelho para erros
        };

        this.el.statusMsg.textContent = mensagem;        // Define o texto da mensagem
        this.el.statusMsg.style.color = cores[tipo] || cores.normal; // Aplica a cor correspondente ao tipo
    
    },
    // Reseta todos os campos do formulário e limpa mensagens de status
    limparFormulario() {
        this.el.form.reset();       // Restaura o formulário ao estado inicial
        this.el.mostrarMensagem(''); // Limpa qualquer mensagem exibida
    }
};