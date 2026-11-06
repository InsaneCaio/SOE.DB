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
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const nomePaciente = document.getElementById('nome-paciente').value || "Não informado";
    const telefonePaciente = document.getElementById('telefone-paciente').value || "Não informado";
    const nomeOperador = document.getElementById('nome-operador').value || "Não informado";
    const valorTotalText = document.getElementById('valor-total').textContent;

    // Cabeçalho
    doc.setFillColor(0, 86, 179); // Cor azul institucional
    doc.rect(0, 0, 210, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("ORÇAMENTO DE EXAMES - AVA", 105, 16, { align: "center" });

    // Informações gerais
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(10);
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 14, 34);
    doc.text(`Paciente: ${nomePaciente}`, 14, 41);
    doc.text(`Telefone: ${telefonePaciente}`, 14, 48);
    doc.text(`Operador: ${nomeOperador}`, 14, 55);

    // Mapeia os itens da tabela
    const dadosTabela = itemsOrcamento.map((item, index) => [
        index + 1,
        item.nome,
        `R$ ${parseFloat(item.valor.toString().replace(',', '.')).toFixed(2).replace('.', ',')}`,
        item.obs || '-'
    ]);

    // Desenha a tabela estilizada
    doc.autoTable({
        startY: 62,
        head: [['#', 'Exame', 'Valor', 'Observações']],
        body: dadosTabela,
        theme: 'striped',
        headStyles: {
            fillColor: [0, 86, 179],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        columnStyles: {
            0: { cellWidth: 12, halign: 'center' },
            1: { cellWidth: 70 },
            2: { cellWidth: 35, halign: 'right' },
            3: { cellWidth: 'auto' }
        },
        foot: [['', 'Total', valorTotalText, '']],
        footStyles: {
            fillColor: [240, 240, 240],
            textColor: [0, 86, 179],
            fontStyle: 'bold',
            fontSize: 11
        }
    });

    doc.save(`Orcamento_${nomePaciente.replace(/\s+/g, '_')}.pdf`);
}