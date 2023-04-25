// Matriz del laberinto
const laberinto = generarLaberinto(10,16);

function generarLaberinto(filas, columnas) {
    // Crea una matriz con todas las paredes
    const matriz = [];
    for (let i = 0; i < filas; i++) {
      matriz.push([]);
      for (let j = 0; j < columnas; j++) {
        matriz[i][j] = "W";
      }
    }
  
    // Agrega los puntos de inicio y fin al laberinto
    matriz[1][1] = "S";
    matriz[filas - 2][columnas - 2] = "E";

    const border = Math.floor(Math.random() * 4); // Elige un borde aleatorio (0 = arriba, 1 = derecha, 2 = abajo, 3 = izquierda)
    switch (border) {
      case 0: // Arriba
        matriz[0][Math.floor(Math.random() * columnas)] = "E";
        break;
      case 1: // Derecha
        matriz[Math.floor(Math.random() * filas)][columnas - 1] = "E";
        break;
      case 2: // Abajo
        matriz[filas - 1][Math.floor(Math.random() * columnas)] = "E";
        break;
      case 3: // Izquierda
        matriz[Math.floor(Math.random() * filas)][0] = "E";
        break;
    }
    
    // Elimina las paredes que rodean la salida (E)
    for (let i = 0; i < filas; i++) {
      for (let j = 0; j < columnas; j++) {
        if (matriz[i][j] === "W" && (
          (i > 0 && matriz[i-1][j] === "E") ||
          (j > 0 && matriz[i][j-1] === "E") ||
          (i < filas - 1 && matriz[i+1][j] === "E") ||
          (j < columnas - 1 && matriz[i][j+1] === "E")
        )) {
          matriz[i][j] = " ";
        }
      }
    }

  
    // Genera el laberinto aleatorio utilizando el algoritmo de backtracking
    function generar(x, y) {
      const vecinos = [
        [x - 2, y],
        [x, y - 2],
        [x + 2, y],
        [x, y + 2]
      ];
  
      // Selecciona un vecino aleatorio y elimina la pared entre él y la coordenada actual
      vecinos.sort(function() {
        return Math.random() - 0.5;
      });
      for (let i = 0; i < vecinos.length; i++) {
        const [vx, vy] = vecinos[i];
        if (vx > 0 && vx < filas - 1 && vy > 0 && vy < columnas - 1 && matriz[vx][vy] === "W") {
          matriz[vx][vy] = " ";
          matriz[vx + Math.sign(x - vx)][vy + Math.sign(y - vy)] = " ";
          generar(vx, vy);
        }
      }
    }
  
    // Agrega las paredes externas al laberinto
    for (let i = 0; i < filas; i++) {
      matriz[i][0] = "W";
      matriz[i][columnas - 1] = "W";
    }
    for (let j = 0; j < columnas; j++) {
      matriz[0][j] = "W";
      matriz[filas - 1][j] = "W";
    }
  
    // Genera el laberinto aleatorio
    generar(1, 1);
  
    // Devuelve la matriz del laberinto generado
    return matriz;
  }
  


// Función que convierte el laberinto en un grafo
function crearGrafo(laberinto) {
  const grafo = {};
  for (let i = 0; i < laberinto.length; i++) {
    for (let j = 0; j < laberinto[0].length; j++) {
      if (laberinto[i][j] !== "W") {
        const id = `${i},${j}`;
        const vecinos = [];
        if (i > 0 && laberinto[i - 1][j] !== "W") {
          vecinos.push("" + (i - 1) + "," + j);
        }
        // Agregar vecino hacia abajo
        if (i < laberinto.length - 1 && laberinto[i + 1][j] !== "W") {
          vecinos.push("" + (i + 1) + "," + j);
        }
        // Agregar vecino hacia la izquierda
        if (j > 0 && laberinto[i][j - 1] !== "W") {
          vecinos.push("" + i + "," + (j - 1));
        }
        // Agregar vecino hacia la derecha
        if (j < laberinto[0].length - 1 && laberinto[i][j + 1] !== "W") {
          vecinos.push("" + i + "," + (j + 1));
        }

        grafo[id] = vecinos;
      }
    }
  }
  return grafo;
}

// Función de búsqueda en anchura
function busquedaAnchura(grafo, inicio, objetivo) {
  const cola = [inicio];
  const padres = { [inicio]: null };
  while (cola.length > 0) {
    const nodoActual = cola.shift();
    if (nodoActual === objetivo) {
      break;
    }
    for (const vecino of grafo[nodoActual]) {
      if (!padres.hasOwnProperty(vecino)) {
        cola.push(vecino);
        padres[vecino] = nodoActual;
      }
    }
  }
  if (!padres.hasOwnProperty(objetivo)) {
    return null; // No se encontró camino
  }
  const camino = [];
  let nodoActual = objetivo;
  while (nodoActual !== inicio) {
    camino.push(nodoActual);
    nodoActual = padres[nodoActual];
  }
  camino.push(inicio);
  camino.reverse();
  return camino;
}

// Programa principal
const grafo = crearGrafo(laberinto);
const inicio = "1,1";
const objetivo = "5,7";
const camino = busquedaAnchura(grafo, inicio, objetivo);
console.log(camino); // ["1,1", "1,2", "2,2", "3,2", "3,3", "3,4", "3,5", "3,6", "4,6", "5,6", "5,7"]

document.addEventListener("DOMContentLoaded", function () {
  const tabla = document.getElementById("laberinto");
  // Resto del código...
  for (let i = 0; i < laberinto.length; i++) {
    const fila = document.createElement("tr");
    for (let j = 0; j < laberinto[0].length; j++) {
      const celda = document.createElement("td");
      celda.textContent = laberinto[i][j];
      fila.appendChild(celda);
    }
    tabla.appendChild(fila);
  }
});


function encontrarObjetivo(laberinto) {
    // Iterar sobre todas las celdas del laberinto
    for (let i = 0; i < laberinto.length; i++) {
      for (let j = 0; j < laberinto[0].length; j++) {
        // Si se encuentra la celda objetivo, devolver sus coordenadas
        if (laberinto[i][j] === "E") {
          return `${i},${j}`;
        }
      }
    }
    // Si no se encuentra la celda objetivo, devolver null
    return null;
  }
  
  function resolverLaberinto(evento) {
    // Obtener la tabla y las coordenadas de la celda clickeada
    const tabla = document.getElementById("laberinto");
    const x = evento.target.cellIndex;
    const y = evento.target.parentNode.rowIndex;
    
    // Definir la celda de inicio y encontrar la celda objetivo
    const inicio = "1,1";
    const objetivo = encontrarObjetivo(laberinto);
    
    // Si no se encuentra la celda objetivo, mostrar un mensaje de error
    if (objetivo === null) {
      alert("No se encontró la celda objetivo");
      return;
    }
    
    // Crear un grafo a partir del laberinto y buscar el camino desde inicio hasta objetivo
    const grafo = crearGrafo(laberinto);
    const camino = busquedaAnchura(grafo, inicio, objetivo);
    
    // Cambiar el estilo de las celdas del camino
    for (const nodo of camino) {
      const coordenadas = nodo.split(",");
      const i = parseInt(coordenadas[0]);
      const j = parseInt(coordenadas[1]);
      tabla.rows[i].cells[j].style.backgroundColor = "yellow";
    }
  }
  
  

// Asociar la función a un evento de click en el botón
const boton = document.getElementById("boton");
boton.addEventListener("click", resolverLaberinto);
