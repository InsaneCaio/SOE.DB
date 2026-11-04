let listaExames = JSON.parse(localStorage.getItem('examesCadastrados')) || [];

function carregarTabela (){
    const tbody = document.getElementById('lista-exames');
    tbody.innerHTML = '';

    listaExames.forEach((exame, index) => {
        const novaLinha = document.createElement('tr');

        const celulaNome = document.createElement('td');
        celulaNome.textContent = exame.nome;

        const celulaValor = document.createElement('td');
        celulaValor.textContent = exame.valor;

        const celulaObs = document.createElement('td');
        celulaObs.textContent = exame.obs;

        var btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';

        btnExcluir.addEventListener('click', function(event) {
            event.preventDefault();

            console.log("O botao excluir foi clicado no item: ", index);

            listaExames.splice(index, 1);

            salvarLista();
        })

        novaLinha.appendChild(celulaNome);
        novaLinha.appendChild(celulaValor);
        novaLinha.appendChild(celulaObs);
        novaLinha.appendChild(btnExcluir);

        tbody.appendChild(novaLinha);
    });
}

function salvarLista() {
    localStorage.setItem('examesCadastrados', JSON.stringify(listaExames));

    carregarTabela();
}

carregarTabela();

const btnAdd = document.getElementById('btnAdicionar');
btnAdd.addEventListener('click', function(event) {
    event.preventDefault();

    console.log("O botao add foi clicado!");

    const nomeExame = document.getElementById('nome').value;
    const valorExame = document.getElementById('valor').value;
    const obsExame = document.getElementById('obs').value;

    console.log(nomeExame);
    console.log(valorExame);
    console.log(obsExame);
 
    const novoExame = {
        nome: nomeExame,
        valor: valorExame,
        obs: obsExame
    }

    listaExames.push(novoExame);

    salvarLista();

    if (novoExame.valor == 0){
        listaExames = [];
    }

    console.log("Lista atualizada de exames: ", listaExames);


});

