export function generarCoordenadaAleatoria() {
  // Rango de latitud (-90 a 90 grados)
  var latitud = Math.random() * 180 - 90;

  // Rango de longitud (-180 a 180 grados)
  var longitud = Math.random() * 360 - 180;

  return [latitud, longitud];
}

export function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
