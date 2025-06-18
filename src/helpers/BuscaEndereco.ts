export async function buscarLatitudeLongitude(user) {
  const rua = user.endereco.edrua || '';
  const cep = user.endereco.edcep || '';
  const municipio = user.endereco.municipio.mcmunicipio || '';
  const estado = user.endereco.estado.esestado || '';
  const sigla = user.endereco.estado.essigla || '';

  const enderecoCompleto = `${rua}, ${cep}, ${municipio}, ${estado}, ${sigla}`;
  const encodedEndereco = encodeURIComponent(enderecoCompleto);

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedEndereco}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SeuApp/1.0 (seu@email.com)',
      },
    });

    const data = await response.json();

    if (data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    } else {
      return {
        latitude: -27.1048361,
        longitude: -52.6142228,
      };
    }
  } catch (error) {
    console.error('Erro ao buscar coordenadas:', error);
    return {
      latitude: -27.1048361,
      longitude: -52.6142228,
    };
  }
}
