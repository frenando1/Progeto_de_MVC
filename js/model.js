// Configurações de conexão com o Supabase (substituir pelas credenciais reais)
const SUPABASE_URL = "";
const SUPABASE_KEY = "";

// Cabeçalhos base comuns a todas as requisições (autenticação via API Key)
const HEADERS_BASE = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`
};

// Objeto Model responsável pela comunicação com o banco de dados (camada de dados do MVC)
// Contém apenas a lógica de acesso a dados, sem qualquer regra de negócio ou UI
const Model = {

    // GET - Busca todos os registros da tabela "boletim", ordenados por ID decrescente
    async buscarTodos() {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/boletim?select=*&order=id.desc`,
            {
                method: 'GET',
                headers: HEADERS_BASE
            }
        );

        return await response.json(); // Retorna o array de registros
    },

    // POST - Insere um novo registro na tabela "boletim" com os dados fornecidos
    async salvar(dados) {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/boletim`, {
            method: 'POST',
            headers: {
                ...HEADERS_BASE,
                'Content-Type': 'application/json' // Necessário para enviar corpo JSON
            },
            body: JSON.stringify(dados) // Converte o objeto para JSON antes de enviar
        });

        // Loga o erro no console caso a requisição falhe, mas retorna false
        if (!response.ok) {
            const erro = await response.json();
            console.error('Supabase rejeitou o POST', erro);
        }

        return response.ok; // Retorna true se o POST foi bem-sucedido, false caso contrário
    },

    // DELETE - Remove um registro da tabela "boletim" filtrando pelo ID
    async excluir(id) {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/boletim?id=eq.${id}`, // Filtro por ID exato (equals)
            {
                method: 'DELETE',
                headers: HEADERS_BASE
            }
        );

        return response.ok; // Retorna true se a exclusão foi bem-sucedida
    }
};