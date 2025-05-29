// lib/api.ts
const API_BASE_URL = "http://localhost:8000"; // ajusta si es necesario

export async function fetchCasinos() {
  const response = await fetch(`${API_BASE_URL}/casinos`);
  if (!response.ok) throw new Error("Error al obtener los casinos");
  return response.json();
}

export async function fetchReportePrevisualizacion(casinoId: string, desde: string, hasta: string) {
  const url = `${API_BASE_URL}/cuadre/previsualizar/${casinoId}?desde=${desde}&hasta=${hasta}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Error al obtener previsualización");
  return response.json();
}

export async function fetchReporteCompleto(casinoId: string, desde: string, hasta: string) {
  const url = `${API_BASE_URL}/cuadre/${casinoId}?desde=${desde}&hasta=${hasta}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Error al obtener el reporte");
  return response.json();
}

export async function guardarReporte(reporte: any) {
  const response = await fetch(`${API_BASE_URL}/cuadre/guardar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reporte),
  });
  if (!response.ok) throw new Error("Error al guardar el reporte");
  return response.json();
}
