// Retorna número de dias em um mês/ano
function getDaysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

// Adiciona zero à esquerda (ex: 1 → 01)
function pad(num, size) {
  return num.toString().padStart(size, '0');
}

// Valida CPF (algoritmo completo)
function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;

  return true;
}

// Variável global para armazenar as batidas
let resultadoBatidas = [];

// Gera uma variação aleatória em minutos (±maxMinutos)
function randomizeTime(timeStr, maxMinutos = 5) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const totalMin = h * 60 + m;
  // Geração de variação de -maxMinutos a +maxMinutos
  const variation = Math.floor(Math.random() * (2 * maxMinutos + 1)) - maxMinutos;
  let newTotalMin = totalMin + variation;
  if (newTotalMin < 0) newTotalMin = 0; // evita horário negativo
  if (newTotalMin >= 24 * 60) newTotalMin = 24 * 60 - 1; // evita passar de 23:59
  const newH = Math.floor(newTotalMin / 60);
  const newM = newTotalMin % 60;
  return `${pad(newH, 2)}${pad(newM, 2)}`;
}

// Função principal: gerar batidas
function gerarBatidas(event) {
  event.preventDefault(); // evita reload do form

  // Captura valores do form
  const cpf = document.getElementById('cpfInput').value.trim();
  const month = parseInt(document.getElementById('month').value);
  const year = parseInt(document.getElementById('year').value);
  const ent1 = document.getElementById('ent1').value;
  const sai1 = document.getElementById('sai1').value;
  const ent2 = document.getElementById('ent2').value;
  const sai2 = document.getElementById('sai2').value;
  const randomize = document.querySelector('input[name="randomize"]').checked;

  // Valida CPF
  if (!validarCPF(cpf)) {
    alert("Digite um CPF válido.");
    return;
  }

  // Número de dias no mês selecionado
  const diasNoMes = getDaysInMonth(month, year);
  resultadoBatidas = []; // limpa array antes de gerar

  // Gera linhas
  for (let dia = 1; dia <= diasNoMes; dia++) {
    const diaStr = pad(dia, 2);
    const mesStr = pad(month, 2);
    const anoStr = year.toString();

    if (ent1) resultadoBatidas.push(`${cpf}${diaStr}${mesStr}${anoStr}${randomize ? randomizeTime(ent1) : ent1.replace(':', '')}`);
    if (sai1) resultadoBatidas.push(`${cpf}${diaStr}${mesStr}${anoStr}${randomize ? randomizeTime(sai1) : sai1.replace(':', '')}`);
    if (ent2) resultadoBatidas.push(`${cpf}${diaStr}${mesStr}${anoStr}${randomize ? randomizeTime(ent2) : ent2.replace(':', '')}`);
    if (sai2) resultadoBatidas.push(`${cpf}${diaStr}${mesStr}${anoStr}${randomize ? randomizeTime(sai2) : sai2.replace(':', '')}`);
  }

  alert(`Batidas geradas com sucesso! Total: ${resultadoBatidas.length}`);
}

// Limpar formulário
function limpar() {
  document.getElementById('appointments').reset();
  resultadoBatidas = [];
  alert("Formulário limpo!");
}

// Copiar batidas para área de transferência
function copiar() {
  if (!resultadoBatidas.length) return alert("Nada para copiar!");
  navigator.clipboard.writeText(resultadoBatidas.join('\n'))
    .then(() => alert("Conteúdo copiado!"))
    .catch(() => alert("Erro ao copiar"));
}

// Baixar batidas como arquivo .txt
function baixarArquivo() {
  if (!resultadoBatidas.length) return alert("Nada para baixar!");

  const blob = new Blob([resultadoBatidas.join('\n')], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "batidas.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Listener do form
document.getElementById('appointments').addEventListener('submit', gerarBatidas);
