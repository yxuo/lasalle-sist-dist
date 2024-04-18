const url = "http://localhost:3002";

document.addEventListener('DOMContentLoaded', async () => {
    const bancoDados = document.getElementById('banco-dados');
    bancoDados.addEventListener('change', async () => { await getTableList(); })

    const tabela = document.getElementById('nome-table');
    tabela.addEventListener('change', async () => { await getTableItems(); })

    const inserirBtn = document.getElementById('inserir-registro-btn');
    inserirBtn.addEventListener('click', async () => { await insertItem(); })

    await getDbList();
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

    await getTableList();
}

async function getTableList() {
    const selectDb = document.getElementById('banco-dados');
    const selectTable = document.getElementById('nome-table');
    selectTable.innerHTML = '';
    const { result } = await (await fetch(`${url}/api/table/list/${selectDb.value}`)).json();

    for (const table of result || []) {
        const option = document.createElement('option');
        option.value = table;
        option.textContent = table;
        selectTable.appendChild(option);
    }
    await getTableItems();
}

/**
 * @example
    <div id="table-fields" class=" input__box">
        <p class="table-field-container">
            <label for="field-1">Field 1</label> <br>
            <input type="text" name="" id="field-1" class="input__search">

            <input type="checkbox" id="insert-field-1" name="nulo" value="insert" checked>
            <label for="insert-field-1">Inserir</label>
            <input type="checkbox" id="null-field-1" name="inserir" value="null">
            <label for="null-field-1">Nulo</label>
        </p>
        <p class="table-field-container">
            <label for="field-2">Field 2</label> <br>
            <input type="numebr" name="" id="field-" class="input__search">
        </p>
    </div>
 */
async function getTableItems() {
    const database = document.getElementById('banco-dados').value;
    const table = document.getElementById('nome-table').value;
    const tableFields = document.getElementById('table-fields');
    tableFields.innerHTML = '';

    const response = await (await fetch(`${url}/api/table/structure/${database}/${table}`)).json();
    /**
     * @type {{
     *  Field: string;
     *  Type: string;
     *  Null: 'NO' | 'YES';
     *  Key: string;
     *  Default: null;
     *  Extra: string;
     * }[]}
    */
    const fields = response?.fields || [];

    console.log('STUCTURE HTML', response, fields)

    for (const field of fields) {
        const fieldSize = field.Type.match(/\d+/)?.[0] || 0;
        const fieldType = field.Type.startsWith('int') ? 'number' : 'text';
        const fieldName = field.Field;

        const fieldContainer = document.createElement('p');
        fieldContainer.classList.add('table-field-container');

        // Value
        const valueInput = document.createElement('input');
        valueInput.type = fieldType === 'number' ? 'number' : 'search';
        valueInput.id = `field-${fieldName}`;
        valueInput.classList.add('input__search');
        valueInput.classList.add('field-content');
        valueInput.setAttribute('fieldType', fieldType);

        if (fieldType === 'text') {
            valueInput.setAttribute('minlength', 0);
            if (fieldSize > 0) {
                valueInput.setAttribute('maxlength', fieldSize);
            }
        } else {
            valueInput.min = 0;
            if (fieldSize > 0) {
                valueInput.max = fieldSize;
            }
        }

        const valueLabel = document.createElement('label');
        valueLabel.classList.add('field-name')
        valueLabel.htmlFor = `field-${fieldName}`;
        valueLabel.innerText = fieldName;

        // Insert
        const insertCheck = document.createElement('input');
        insertCheck.classList.add('insert-check')
        insertCheck.type = 'checkbox';
        insertCheck.id = `insert-field-${fieldName}`;
        insertCheck.checked = true;

        const insertLabel = document.createElement('label');
        insertLabel.classList.add('insert-label')
        insertLabel.htmlFor = `insert-field-${fieldName}`;
        insertLabel.innerText = 'Inserir';

        // Null
        // const nullLabel = document.createElement('label');
        // nullLabel.classList.add('null-label')
        // nullLabel.for = `null-field-${fieldName}`;
        // nullLabel.innerText = fieldName;

        // const nullCheck = document.createElement('input');
        // nullCheck.classList.add('null-check')
        // nullCheck.type = 'checkbox';
        // nullCheck.id = `null-field-${fieldName}`;
        // nullCheck.checked = true;

        fieldContainer.appendChild(valueLabel);
        fieldContainer.appendChild(document.createElement('br'));
        fieldContainer.appendChild(valueInput);
        fieldContainer.appendChild(document.createElement('br'));
        fieldContainer.appendChild(insertCheck);
        fieldContainer.appendChild(insertLabel);
        // fieldContainer.appendChild(nullCheck);
        // fieldContainer.appendChild(nullLabel);
        tableFields.appendChild(fieldContainer);
    }
}

async function insertItem() {
    const database = document.getElementById('banco-dados').value;
    const table = document.getElementById('nome-table').value;
    const fields = document.querySelectorAll('#table-fields>.table-field-container');

    /** @type { Record<string, number | string > } */
    const bodyFields = {};

    for (const field of fields) {
        /** @type {boolean} */
        const isInsertField = field.querySelector('.insert-check').checked;
        if (!isInsertField) {
            continue;
        }

        const fieldName = field.querySelector('.field-name').innerText;
        const fieldContent = field.querySelector('.field-content');

        /** @type { 'number' | 'text' } */
        const fieldType = fieldContent.getAttribute('fieldType');

        /** @type { string | number } } */
        let fieldValue = null;
        if (fieldType === 'number') {
            fieldValue = parseInt(fieldContent.value);
        } else {
            fieldValue = String(fieldContent.value);
        }
        bodyFields[fieldName] = fieldValue;
    }

    const response = await fetch(`${url}/api/table/insert/${database}/${table}`, {
        method: 'POST',
        body: JSON.stringify(bodyFields)
    });
    if (response.ok) {
        alert(`Registro inserido com sucesso.`)
    } else {
        alert(`Falha ao executar:\n${(await response.json()).message}`)
    }
}