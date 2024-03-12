const path = require('path');

module.exports = {
  mode: 'production', // O 'development' para el modo de desarrollo
  entry: './src/server.js', // Archivo de entrada principal de tu aplicación
  output: {
    path: path.resolve(__dirname, 'public'), // Carpeta de salida
    filename: 'bundle.js' // Nombre del archivo de salida
  },
  // Configuración adicional según sea necesario
  // Por ejemplo, manejo de módulos, plugins, etc.
};