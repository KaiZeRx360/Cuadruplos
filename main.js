let contadorTemp = 0;
let cuadruplos = [];

const calcularResultado = (exp) => {
    const elementos = dividirExpresion(exp);
    const resultado = evaluarElementos(elementos);
    return resultado;
};

const dividirExpresion = (exp) => {
    return exp.match(/(\d+|[-+*/()])/g);
};

const evaluarElementos = (elementos) => {
    const salida = [];
    const operadores = [];
    const precedencia = { '+': 1, '-': 1, '*': 2, '/': 2 };

    elementos.forEach(elemento => {
        if (!isNaN(elemento)) {
            salida.push(parseFloat(elemento));
        } else if (elemento === '(') {
            operadores.push(elemento);
        } else if (elemento === ')') {
            while (operadores.length && operadores[operadores.length - 1] !== '(') {
                salida.push(operadores.pop());
            }
            operadores.pop();
        } else {
            while (
                operadores.length &&
                precedencia[elemento] <= precedencia[operadores[operadores.length - 1]]
            ) {
                salida.push(operadores.pop());
            }
            operadores.push(elemento);
        }
    });

    while (operadores.length) {
        salida.push(operadores.pop());
    }

    return evaluarPostfijoConCuadruplos(salida);
};

const evaluarPostfijoConCuadruplos = (postfijo) => {
    const pilaResultado = [];

    postfijo.forEach(elemento => {
        if (typeof elemento === 'number') {
            pilaResultado.push(elemento);
        } else {
            const b = pilaResultado.pop();
            const a = pilaResultado.pop();
            const temporal = generarTemporal();

            let cuadruplo = {
                operador: elemento,
                operando1: a,
                operando2: b,
                resultado: temporal,
                valor: calcularValor(elemento, a, b) 
            };

            cuadruplos.push(cuadruplo);
            pilaResultado.push(cuadruplo.valor); 
        }
    });

    mostrarCuadruplos();
    return pilaResultado[0]; 
};

const calcularValor = (operador, a, b) => {
    switch (operador) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            return a / b;
        default:
            return null;
    }
};

const generarTemporal = () => {
    contadorTemp++;
    return `t${contadorTemp}`;
};

const mostrarCuadruplos = () => {
    const divCuadruplos = document.getElementById('quad');
    if (cuadruplos.length === 0) {
        divCuadruplos.innerHTML = 'No se generaron cuádruplos.';
    } else {
        divCuadruplos.innerHTML = 'Cuádruplos generados:<br>' + cuadruplos.map((cuadruplo, index) => 
            `(${index + 1}) ${cuadruplo.operador}, ${cuadruplo.operando1}, ${cuadruplo.operando2}, ${cuadruplo.resultado} = ${cuadruplo.valor}`
        ).join('<br>');
    }
};

document.getElementById('btnCalc').addEventListener('click', () => {
    const entrada = document.getElementById('exp').value.trim();
    cuadruplos = [];

    if (!entrada) {
        swal("Error", "La expresión no puede estar vacía.", "error");
        return;
    }

    if (/[^0-9+\-*/() ]/.test(entrada)) {
        swal("Error", "La expresión solo puede contener números y operadores matemáticos.", "error");
        return;
    }

    const resultado = calcularResultado(entrada);
    const divResultado = document.getElementById('res');

    if (resultado !== undefined) {
        divResultado.innerHTML = `Resultado Final: ${resultado}`; 
        swal("Éxito", "La operación se ha realizado con éxito.", "success");
    } else {
        swal("Error", "No se pudo calcular la expresión.", "error");
    }
});

document.getElementById('btnClear').addEventListener('click', () => {
    document.getElementById('exp').value = '';
    document.getElementById('res').innerHTML = '';
    document.getElementById('quad').innerHTML = 'No se generaron cuádruplos.';
});
