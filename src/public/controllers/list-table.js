const url = "http://localhost:3002";

document.addEventListener('DOMContentLoaded', async () => {
    const bancoDados = document.getElementById('banco-dados');
    bancoDados.addEventListener('change', async () => { await getTableList(); })

    const tabela = document.getElementById('nome-table');
    tabela.addEventListener('change', async () => { await getTableItems(); })

    await getDbList();
});

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

    for (const table of result) {
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
    const tableResult = document.getElementById('table-result');
    const noResults = document.getElementById('no-results');
    tableResult.innerHTML = '';

    if (!database || !table) {
        noResults.classList.remove('hidden');
        tableResult.classList.add('hidden');
    } else {
        noResults.classList.add('hidden');
        tableResult.classList.remove('hidden');
    }

    const response = await (await fetch(`${url}/api/table/list/${database}/${table}`)).json();
    /**
     * @type {Record<string, string | number | boolean | null>[]}
    */
    const fields = response?.result || [];

    if (fields.length === 0) {
        noResults.classList.remove('hidden');
        tableResult.classList.add('hidden');
    } else {
        noResults.classList.add('hidden');
        tableResult.classList.remove('hidden');
    }

    // Header - Field names
    const tr = document.createElement('tr');
    for (const field of Object.keys(fields?.[0] || [])) {
        tr.appendChild(createElement('th', { innerText: field }));
    }
    tableResult.appendChild(tr);

    // Body - Field values
    for (const field of fields) {
        const values = Object.values(field);
        const tr = document.createElement('tr');
        for (const value of values) {
            let valueStr = String(value);
            if (value === null) {
                valueStr = '<i>nulo</i>';
            }
            tr.appendChild(createElement('td', { innerText: valueStr }));
        }
        tableResult.appendChild(tr);
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

/**
 * @param {string} tag 
 * @param {any} value '
 * @param { { 
 * innerText?: string;
 * value?: any;
 * } | undefined 
 * } args
 * 
 * @returns {HTMLElement}
 */
function createElement(tag, args) {
    const el = document.createElement(tag);
    if (args?.innerText) {
        el.innerText = args.innerText;
    }
    if (args?.value) {
        el.value = args.value;
    }
    return el;
}