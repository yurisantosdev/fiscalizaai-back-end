export function formatarDataBrasileira(dataISO) {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

export function calcularStatusViagem(vigdatainicio, vigdatafim) {
  const hoje: any = new Date();
  const inicio: any = new Date(vigdatainicio);
  const fim: any = new Date(vigdatafim);

  hoje.setHours(0, 0, 0, 0);
  inicio.setHours(0, 0, 0, 0);
  fim.setHours(0, 0, 0, 0);

  if (hoje < inicio) {
    const diffTime = inicio - hoje;
    const diffDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDias} dia(s) para iniciar`;
  } else if (hoje.getTime() === inicio.getTime()) {
    return 'Hojeee!';
  } else if (hoje > inicio && hoje <= fim) {
    return 'Em viagem';
  } else {
    return 'Finalizada';
  }
}

export function formatarDataHoraBrasileira(dataHora: Date | string) {
  const data = new Date(dataHora);

  data.setHours(data.getUTCHours() - 3);

  const dia = String(data.getUTCDate()).padStart(2, '0');
  const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
  const ano = data.getUTCFullYear();

  const horas = String(data.getUTCHours()).padStart(2, '0');
  const minutos = String(data.getUTCMinutes()).padStart(2, '0');
  const segundos = String(data.getUTCSeconds()).padStart(2, '0');

  return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
}
