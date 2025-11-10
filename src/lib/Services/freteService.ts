import { ENDERECO_LOJA } from "../Constants/horarios";

// Calcula distância entre dois pontos (Haversine)
function calcularDistancia(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function calcularFretePorCEP(cep: string) {
  const cepLimpo = cep.replace(/\D/g, "");

  if (cepLimpo.length !== 8) {
    throw new Error("CEP inválido");
  }

  // Buscar dados do CEP
  const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  const data = await response.json();

  if (data.erro) {
    throw new Error("CEP não encontrado");
  }

  const enderecoCompleto = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;

  // Buscar coordenadas
  const geoResponse = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      `${data.logradouro}, ${data.localidade}, ${data.uf}, Brasil`
    )}`
  );
  const geoData = await geoResponse.json();

  let lat, lng;

  if (geoData.length === 0) {
    // Fallback: usar cidade
    const cidadeResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        `${data.localidade}, ${data.uf}, Brasil`
      )}`
    );
    const cidadeData = await cidadeResponse.json();

    if (cidadeData.length === 0) {
      throw new Error("Não foi possível calcular a distância");
    }

    lat = parseFloat(cidadeData[0].lat);
    lng = parseFloat(cidadeData[0].lon);
  } else {
    lat = parseFloat(geoData[0].lat);
    lng = parseFloat(geoData[0].lon);
  }

  const distancia = calcularDistancia(
    ENDERECO_LOJA.latitude,
    ENDERECO_LOJA.longitude,
    lat,
    lng
  );

  return {
    endereco: enderecoCompleto,
    valorFrete: distancia.toFixed(2),
  };
}