const url = "http://localhost:3000";

document.addEventListener('DOMContentLoaded', async () => {
    const inputCampos = document.getElementById('campos-table');
    inputCampos.min = 0;
    await getDbList();
    const estruturaDinamica = document.getElementById('estrutura-dinamica');
    const arrayTipos = ["INT", "VARCHAR"];
    const createTableBtn = document.getElementById('criar-tabela-btn');
    createTableBtn.addEventListener('click', async () => await createTable())
    inputCampos.addEventListener('change', async () => {
        const quantidadeDesejada = inputCampos.value;

        const quantidadeAtual = estruturaDinamica.children.length;

        if (quantidadeDesejada < quantidadeAtual) {
            while (quantidadeAtual > quantidadeDesejada) {
                estruturaDinamica.removeChild(estruturaDinamica.lastChild);
                quantidadeAtual--;
            }
        } else {
            for (let i = quantidadeAtual; i < quantidadeDesejada; i++) {
                const divBox = document.createElement('div');
                divBox.className = 'table__inputs__box';

                const labelBox = document.createElement('div');
                labelBox.className = 'label__box';

                const spanDescricao = document.createElement('span');
                spanDescricao.textContent = `Coluna ${i + 1}`;

                const label = document.createElement('label');
                const isPkId = `is-pk-${i}`
                label.innerText = 'Chave';
                label.htmlFor = isPkId;

                labelBox.appendChild(spanDescricao);
                labelBox.appendChild(label);

                const isPk = document.createElement('input');
                isPk.id = isPkId;
                isPk.type = 'radio';
                isPk.name = 'radioGroup';
                isPk.addEventListener('change', function () {
                    document.querySelectorAll('input[type=radio][name="radioGroup"]')
                        .forEach(function (radio) {
                            if (radio !== isPk) {
                                radio.checked = false;
                            }
                        });
                });

                const inputSearch = document.createElement('input');
                inputSearch.className = 'input__search';
                inputSearch.type = 'search';

                const selectTypes = document.createElement('select');
                selectTypes.name = 'types';

                arrayTipos.forEach(function (tipo) {
                    const option = document.createElement('option');
                    option.value = tipo;
                    option.textContent = tipo;
                    selectTypes.appendChild(option);
                });

                const fieldSize = document.createElement('input');
                fieldSize.type = 'number';
                fieldSize.min = 0;

                divBox.appendChild(labelBox);
                divBox.appendChild(isPk);
                divBox.appendChild(inputSearch);
                divBox.appendChild(selectTypes);
                divBox.appendChild(fieldSize);
                estruturaDinamica.appendChild(divBox);
            }
        }
    });
});

/**
 @example {
  "name": "itens2",
  "database": "abc",
  "fields": [
    {
      "key": true,
      "nome": "id",
      "type": "INT",
      "size": -1
    },
    {
      "key": false,
      "nome": "nome",
      "type": "VARCHAR",
      "size": 50
    }
  ]
}
 */
async function createTable() {
    const fieldInputs = document.getElementsByClassName('table__inputs__box');
    /**
     * @type {{
     * isPrimaryKey: string;
     * nome: string;
     * type: string;
     * size: number; 
     * }[]}
     */
    const fields = [];
    for (const fieldInput of fieldInputs) {
        fields.push({
            isPrimaryKey: fieldInput.querySelector('[type="radio"]').checked,
            nome: fieldInput.querySelector('.input__search').value,
            size: Number(fieldInput.querySelector('[type="number"]').value) || 0,
            type: fieldInput.querySelector('[name="types"]').value,
        });
    }
    const bancoDados = document.getElementById('banco-dados').value;
    const nomeTabela = document.getElementById('nome-table').value;
 
    const body = {
        fields: fields,
    }
    console.log('BODY', body)
    const response = await fetch(`${url}/api/table/create/${bancoDados}/${nomeTabela}`, {
        method: 'POST',
        body: JSON.stringify(body)
    });
    if (response.ok) {
        alert(`Tabela criada com sucesso.`)
    } else {
        alert(`Falha ao executar:\n${(await response.json()).message}`)
    }
}

async function getDbList() {
    const selectDb = document.getElementById('banco-dados');
    selectDb.name = 'Db';
    const { databases } = await (await fetch(`${url}/api/db/list`)).json();

    for (const database of databases) {
        const option = document.createElement('option');
        option.value = database;
        option.textContent = database;
        selectDb.appendChild(option);
    }
}