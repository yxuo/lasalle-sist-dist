document.addEventListener('DOMContentLoaded', function () {
    const inputCampos = document.getElementById('campos-table');
    const estruturaDinamica = document.getElementById('estrutura-dinamica');
    const arrayTipos = ["INT", "VARCHAR"];

    inputCampos.addEventListener('change', function () {
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
                spanDescricao.textContent = `Descrição ${i + 1}`;

                const label = document.createElement('label');
                label.innerText = 'Chave';
                
                labelBox.appendChild(spanDescricao);
                labelBox.appendChild(label);

                const inputRadio = document.createElement('input');
                inputRadio.type = 'radio';
                inputRadio.name = 'radioGroup';
                inputRadio.addEventListener('change', function () {
                    document.querySelectorAll('input[type=radio][name="radioGroup"]').forEach(function (radio) {
                        if (radio !== inputRadio) {
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

                const inputNumber = document.createElement('input');
                inputNumber.type = 'number';

                divBox.appendChild(labelBox);
                divBox.appendChild(inputRadio);
                divBox.appendChild(inputSearch);
                divBox.appendChild(selectTypes);
                divBox.appendChild(inputNumber);
                estruturaDinamica.appendChild(divBox);
            }
        }
    });
});
