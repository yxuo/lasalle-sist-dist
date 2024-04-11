const url = "http://localhost:3000"
async function criarBanco() {
  const nomeBancoInput = document.getElementById('nome-banco').value;
  const response = await fetch(`${url}/api/db/create/${nomeBancoInput}`);
  if (response.status === 200) {
    alert('Banco de dados criado com sucesso!')
    window.location.href = `${url}/create-table`
  }
  else {
    alert('Banco de dados ja existe no sistema ❌')
  }
}

window.onload = async () => {
  console.log("INIT")
  const criarBancoBtn = document.getElementById('criar-banco-btn');
  criarBancoBtn.addEventListener('click', async () => await criarBanco());
};

