import { connection } from "../context/db.js";


async function criarBanco() {
  const nomeBanco = document.getElementById('nome-banco').value;

  // Criação do banco de dados usando IndexedDB
  const [queryResult, fieldPacket] = await connection.query(`CREATE TABLE IF NOT EXISTS ${nomeBanco}`)
  console.log('RESULTADO:',queryResult, fieldPacket);

}

window.onload = async () => {
  console.log("INIT")
  const criarBancoBtn = document.getElementById('criar-banco-btn');
  criarBancoBtn.addEventListener('click', async () => await criarBanco());
};