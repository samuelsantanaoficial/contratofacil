function gerarPDF() {
    // 1. Tratamento de Valores
    let valorInput = document.getElementById('servicoValor').value;
    let valorNumerico = 0;
    try {
        valorNumerico = parseFloat(valorInput.replace('.', '').replace(',', '.'));
    } catch (e) { valorNumerico = 0; }
    if (isNaN(valorNumerico)) valorNumerico = 0;

    const valorTotal = valorNumerico.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const valorMetade = (valorNumerico / 2).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

    // 2. Coleta de Dados (Configuração Fixa)
    const eu = {
        nome: document.getElementById('meuNome').value,
        cpf: document.getElementById('meuCPF').value,
        end: document.getElementById('meuEndereco').value,
        pix: document.getElementById('minhaChavePix').value,
        cidade: document.getElementById('minhaCidade').value
    };

    // 3. Coleta de Dados (Formulário Variável)
    const cli = {
        nome: document.getElementById('cliNome').value,
        cpf: document.getElementById('cliCPF').value,
        end: document.getElementById('cliEndereco').value,
        email: document.getElementById('cliEmail').value
    };
    const servico = {
        objeto: document.getElementById('servicoObjeto').value,
        itens: document.getElementById('servicoItens').value,
        prazo: document.getElementById('prazoServico').value, // Novo campo
        extra: document.getElementById('clausulaExtra').value, // Novo campo
        data: document.getElementById('dataContrato').value
    };

    const dataObj = new Date(servico.data || new Date());
    const dataFormatada = dataObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
    const listaItens = servico.itens.split('\n').filter(item => item.trim() !== "");

    // 4. Definição do PDF
    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [30, 30, 30, 30],
        info: { title: `Contrato - ${cli.nome}` },
        content: [
            { text: 'CONTRATO DE PRESTAÇÃO DE SERVIÇOS', style: 'header' },

            { text: 'Pelo presente instrumento particular, as partes abaixo qualificadas têm, entre si, justo e contratado o seguinte:', margin: [0, 0, 0, 20], fontSize: 11, alignment: 'justify' },

            // 1. Identificação
            { text: '1. DAS PARTES', style: 'sectionTitle' },

            { text: 'CONTRATADA:', style: 'label' },
            { text: `${eu.nome}, inscrito(a) no CPF/CNPJ sob nº ${eu.cpf}, com endereço em ${eu.end}.`, style: 'textBody' },
            { text: `Dados Bancários (Pix): ${eu.pix}`, style: 'textBody', margin: [0, 0, 0, 10] },

            { text: 'CONTRATANTE:', style: 'label' },
            { text: `${cli.nome}, inscrito(a) no CPF/CNPJ sob nº ${cli.cpf}, residente em ${cli.end}.`, style: 'textBody', margin: [0, 0, 0, 10] },

            // 2. Objeto e Escopo
            { text: '2. DO OBJETO E ESCOPO', style: 'sectionTitle' },
            { text: `O presente contrato tem por objeto a prestação de serviços de ${servico.objeto}, a serem realizados com zelo e capacidade técnica pela CONTRATADA, conforme detalhamento abaixo:`, style: 'textBody' },
            { ul: listaItens, style: 'textBody', margin: [20, 10, 0, 10] },

            // 3. Valor
            { text: '3. DO VALOR E PAGAMENTO', style: 'sectionTitle' },
            { text: `Pela execução dos serviços, o CONTRATANTE pagará o valor total de R$ ${valorTotal}, da seguinte forma:`, style: 'textBody' },
            {
                ul: [
                    `Sinal de R$ ${valorMetade} (50%) neste ato, a título de arras e reserva de agenda;`,
                    `Saldo de R$ ${valorMetade} (50%) na conclusão e entrega dos serviços.`
                ],
                style: 'textBody', margin: [20, 5, 0, 10]
            },

            // 4. Prazo (Agora vem do formulário)
            { text: '4. DOS PRAZOS', style: 'sectionTitle' },
            { text: `O prazo estipulado para a execução e entrega dos serviços é de: ${servico.prazo}, podendo ser prorrogado mediante acordo entre as partes ou por motivos de força maior.`, style: 'textBody' },

            // 5. Cláusula extra (Agora vem do formulário)
            { text: '5. DISPOSIÇÕES ESPECÍFICAS', style: 'sectionTitle' },
            { text: `${servico.extra}`, style: 'textBody' },

            // 6. Rescisão
            { text: '6. DA RESCISÃO E OBRIGAÇÕES', style: 'sectionTitle' },
            { text: 'O descumprimento de qualquer cláusula deste contrato faculta à parte prejudicada a rescisão do mesmo. Em caso de desistência imotivada pelo CONTRATANTE, o valor do sinal não será reembolsado, servindo para cobrir custos operacionais (Art. 418 do Código Civil).', style: 'textBody' },

            // 7. Foro
            { text: '7. DO FORO', style: 'sectionTitle' },
            { text: `Fica eleito o Foro da Comarca de ${eu.cidade} para dirimir quaisquer dúvidas oriundas deste contrato, renunciando as partes a qualquer outro.`, style: 'textBody' },

            { text: 'E por estarem justos e contratados, assinam o presente.', style: 'textBody', margin: [0, 10, 0, 10] },

            // Assinaturas
            { text: `${eu.cidade}, ${dataFormatada}.`, alignment: 'center', margin: [0, 10, 0, 30] },

            {
                columns: [
                    { stack: [{ text: '_______________________________' }, { text: 'CONTRATADA', fontSize: 10, bold: true }], alignment: 'center' },
                    { stack: [{ text: '_______________________________' }, { text: 'CONTRATANTE', fontSize: 10, bold: true }], alignment: 'center' }
                ]
            }
        ],
        styles: {
            header: { fontSize: 16, bold: true, alignment: 'center', margin: [0, 0, 0, 25] },
            sectionTitle: { fontSize: 12, bold: true, marginTop: 10, marginBottom: 5, decoration: 'underline' },
            label: { fontSize: 11, bold: true, marginBottom: 2 },
            textBody: { fontSize: 11, alignment: 'justify', lineHeight: 1.0 }
        }
    };

    pdfMake.createPdf(docDefinition).open();
}

// Funções de Persistência e Backup (Atualizadas para salvar APENAS dados da empresa)
function salvarConfiguracoes() {
    const dados = {
        nome: document.getElementById('meuNome').value,
        cpf: document.getElementById('meuCPF').value,
        pix: document.getElementById('minhaChavePix').value,
        endereco: document.getElementById('meuEndereco').value,
        cidade: document.getElementById('minhaCidade').value
        // Removemos prazo e uso daqui
    };
    localStorage.setItem('configContrato', JSON.stringify(dados));
    alert('Dados da empresa salvos com sucesso!');
    new bootstrap.Collapse(document.getElementById('areaConfig')).hide();
}

function carregarDados() {
    const salvos = localStorage.getItem('configContrato');
    if (salvos) {
        const d = JSON.parse(salvos);
        document.getElementById('meuNome').value = d.nome || '';
        document.getElementById('meuCPF').value = d.cpf || '';
        document.getElementById('minhaChavePix').value = d.pix || '';
        document.getElementById('meuEndereco').value = d.endereco || '';
        document.getElementById('minhaCidade').value = d.cidade || '';
    }
    document.getElementById('dataContrato').valueAsDate = new Date();
}

function exportarBackup() {
    const dados = localStorage.getItem('configContrato');
    if (!dados) return alert('Nada salvo para backup!');
    const blob = new Blob([dados], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `backup-empresa-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
}

function importarBackup(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            localStorage.setItem('configContrato', JSON.stringify(JSON.parse(e.target.result)));
            carregarDados();
            alert('Restaurado!');
        } catch (erro) { alert('Erro no arquivo JSON.'); }
    };
    reader.readAsText(file);
}

window.onload = carregarDados;