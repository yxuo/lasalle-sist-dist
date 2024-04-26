document.addEventListener('DOMContentLoaded', async () => {
  
  const url = "http://localhost:3002";
  
  const btnCriarBanco = document.getElementById('btn-criar-banco');
  btnCriarBanco.addEventListener('click', () => {
    window.location.href = `${url}`;
  });
  
  const btnCriarTabela = document.getElementById('btn-criar-tabela');
  btnCriarTabela.addEventListener('click', () => {
    window.location.href = `${url}/create-table`;
  });
  
  const btnInserirTabela = document.getElementById('btn-inserir-tabela');
  btnInserirTabela.addEventListener('click', () => {
    window.location.href = `${url}/insert-table`;
  });
  
  const btnVerTabela = document.getElementById('btn-ver-tabela');
  btnVerTabela.addEventListener('click', () => {
    window.location.href = `${url}/list-table`;
  });

});