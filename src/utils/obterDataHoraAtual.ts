import { DateTime } from 'luxon';

export function exibirDataHoraAtual() {
  const agora = DateTime.now().setZone('America/Sao_Paulo');
  const dataFormatada = agora.toFormat('dd/MM/yyyy HH:mm:ss');
  return dataFormatada;
}
