export function exibirDataHoraAtual() {
  const agora = new Date();
  const dataFormatada = agora.toLocaleDateString('pt-BR');
  const horaFormatada = agora.toLocaleTimeString('pt-BR');

  return `${dataFormatada} ${horaFormatada}`;
};
