// lib/api.ts
const API_BASE_URL = "http://localhost:8000"; // ajusta si es necesario

export async function fetchCasinos() {
  const response = await fetch(`${API_BASE_URL}/listar-lugares`);
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

export async function fetchReporte({ fechaInicio, fechaFin, casino, maquinas }: {
  fechaInicio?: string,
  fechaFin?: string,
  casino?: string,
  maquinas?: string[],
}) {
  const params = new URLSearchParams();
  if (fechaInicio) params.append("fecha_inicio", fechaInicio);
  if (fechaFin) params.append("fecha_fin", fechaFin);
  if (casino && casino !== "Todos") params.append("casino", casino);
  if (maquinas && maquinas.length > 0) {
    maquinas.forEach(m => params.append("maquinas", m));
  }
  const url = `${API_BASE_URL}/reportes/generar-reporte?${params.toString()}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Error al obtener el reporte");
  return response.json();
}

export async function fetchMaquinas() {
  const response = await fetch(`${API_BASE_URL}/maquinas`);
  if (!response.ok) throw new Error("Error al obtener las máquinas");
  return response.json();
}

export async function exportarReporte({ formato, fechaInicio, fechaFin, casino, maquinas, marca, modelo, ciudad }: {
  formato: 'pdf' | 'excel',
  fechaInicio?: string,
  fechaFin?: string,
  casino?: string,
  maquinas?: string[],
  marca?: string,
  modelo?: string,
  ciudad?: string,
}) {
  const params = new URLSearchParams();
  params.append("formato", formato);
  if (fechaInicio) params.append("fecha_inicio", fechaInicio);
  if (fechaFin) params.append("fecha_fin", fechaFin);
  if (casino && casino !== "Todos") params.append("casino", casino);
  if (marca && marca !== "__all__") params.append("marca", marca);
  if (modelo && modelo !== "__all__") params.append("modelo", modelo);
  if (ciudad && ciudad !== "__all__") params.append("ciudad", ciudad);
  if (maquinas && maquinas.length > 0 && maquinas[0] !== "__all__") {
    maquinas.forEach(m => params.append("maquinas", m));
  }
  
  const url = `${API_BASE_URL}/reportes/exportar-reporte?${params.toString()}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Error al exportar el reporte: ${response.statusText}`);
  }
  
  // Obtener el nombre del archivo del header Content-Disposition
  const contentDisposition = response.headers.get('content-disposition');
  let filename = 'reporte';
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1];
    }
  }
  filename += formato === 'pdf' ? '.pdf' : '.xlsx';
  
  // Convertir la respuesta a blob y descargar
  const blob = await response.blob();
  const url_download = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url_download;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url_download);
  document.body.removeChild(a);
}
