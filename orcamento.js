let listaExames = JSON.parse(localStorage.getItem('examesCadastrados')) || [];;

let itemsOrcamento = JSON.parse(localStorage.getItem('itensOrcamentoAtual')) || [];

function iniciarOrcamento() {
    const tbody = document.getElementById('lista-itens-orcamento');
    tbody.innerHTML = '';

    let total = 0;

    itemsOrcamento.forEach((item, index) => {
        const novaLinha = document.createElement('tr');

        const celulaNome = document.createElement('td');
        celulaNome.textContent = item.nome;

        const celulaValor = document.createElement('td');
        celulaValor.textContent = item.valor;

        const celulaObs = document.createElement('td');
        celulaObs.textContent = item.obs;

        var btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';

        btnExcluir.addEventListener('click', function(event) {
            event.preventDefault();
            itemsOrcamento.splice(index, 1);
            salvarOrcamento();
        });

        let valorNumerico = parseFloat(item.valor.toString().replace(',', '.')) || 0;
        total += valorNumerico;

        novaLinha.appendChild(celulaNome);
        novaLinha.appendChild(celulaValor);
        novaLinha.appendChild(celulaObs);
        novaLinha.appendChild(btnExcluir);

        tbody.appendChild(novaLinha);

        document.getElementById('valor-total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    });

    const linhaSelect = document.createElement('tr');
    const celulaSelect = document.createElement('td');
    celulaSelect.colSpan = 4;

    const selectExames = document.createElement('select');

    const optionPadrao = document.createElement('option');
    optionPadrao.textContent = 'Selecione um exame...';
    optionPadrao.value = '';
    optionPadrao.disabled = true;
    optionPadrao.selected = true;
    selectExames.appendChild(optionPadrao);

    listaExames.forEach(exame => {
        const option = document.createElement('option');
        option.textContent = exame.nome;
        option.value = exame.nome;
        selectExames.appendChild(option);
    });

    selectExames.addEventListener('change', function(event) {
        const exameEscolhido = event.target.value;

        const exameEncontrado = listaExames.find(ex => ex.nome === exameEscolhido);

        if (exameEncontrado){
            itemsOrcamento.push(exameEncontrado);
            salvarOrcamento();
        }
    });

    celulaSelect.appendChild(selectExames);
    linhaSelect.appendChild(celulaSelect);
    tbody.appendChild(linhaSelect);
}

function salvarOrcamento() {
    localStorage.setItem('itensOrcamentoAtual', JSON.stringify(itemsOrcamento));
    iniciarOrcamento();
}

iniciarOrcamento();

function gerarPDF() {
    // 1. Inicializa o jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 2. Captura os dados de Identificação do HTML
    const nomePaciente = document.getElementById('nome-paciente').value || "Não informado";
    const telefonePaciente = document.getElementById('telefone-paciente').value || "Não informado";
    const nomeOperador = document.getElementById('nome-operador').value || "Não informado";
    const valorTotalText = document.getElementById('valor-total').textContent;

    // ----------------------------------------------------
    // CABEÇALHO DO DOCUMENTO
    // ----------------------------------------------------
    doc.setFontSize(18);
    doc.text("ORÇAMENTO DE EXAMES - AVA", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);
    
    // ----------------------------------------------------
    // DADOS DO PACIENTE E OPERADOR
    // ----------------------------------------------------
    doc.setFontSize(11);
    doc.text(`Paciente: ${nomePaciente}`, 14, 40);
    doc.text(`Telefone: ${telefonePaciente}`, 14, 47);
    doc.text(`Operador: ${nomeOperador}`, 14, 54);

    // Linha divisória visual
    doc.line(14, 58, 196, 58);

    // ----------------------------------------------------
    // LISTA DE EXAMES ESCOLHIDOS
    // ----------------------------------------------------
    doc.setFontSize(13);
    doc.text("Exames Selecionados:", 14, 66);

    let linhaY = 74; // Posição vertical onde começa a lista

    doc.setFontSize(10);
    
    // Percorre a lista de itens adicionados ao orçamento
    itemsOrcamento.forEach((item, index) => {
        const textoItem = `${index + 1}. Exame: ${item.nome} | Valor: R$ ${item.valor} | Obs: ${item.obs || '-'}`;
        
        doc.text(textoItem, 14, linhaY);
        linhaY += 8; // Pula a linha verticalmente para o próximo item
    });

    // Linha divisória antes do total
    doc.line(14, linhaY + 2, 196, linhaY + 2);

    // ----------------------------------------------------
    // VALOR TOTAL DO ORÇAMENTO
    // ----------------------------------------------------
    doc.setFontSize(14);
    doc.text(`VALOR TOTAL: ${valorTotalText}`, 14, linhaY + 12);

    // ----------------------------------------------------
    // GERAR E BAIXAR O ARQUIVO PDF
    // ----------------------------------------------------
    doc.save(`Orcamento_${nomePaciente.replace(/\s+/g, '_')}.pdf`);
}