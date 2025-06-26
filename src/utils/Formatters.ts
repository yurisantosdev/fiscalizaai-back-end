export function FormatarDataBrasileira(dataISO: any) {
  const data = new Date(dataISO);

  const dataFormatada = data.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return dataFormatada.replace(',', '');
}
