// var options = ["$100", "$10", "$25", "$250", "$30", "$1000", "$1", "$200", "$45", "$500", "$5", "$20", "Lose", "$1000000", "Lose", "$350", "$5", "$99"];
// var options = ["Hacoaj", "Ioias Life", "Random", "Cultura general", "Ciencia y Tech"];
var options = [
    {
        nombre: 'Hacoaj',
        texto: 'Hacoaj',
        contador: 0
    },
    {
        nombre: 'Ioia',
        texto: 'Ioias Life',
        contador: 0
    },
    {
        nombre: 'Cultura',
        texto: 'Cultura general',
        contador: 0
    },
    {
        nombre: 'Random',
        texto: 'Random',
        contador: 0
    },
    {
        nombre: 'SciTech',
        texto: 'Ciencia y Tech',
        contador: 0
    }
];

var startAngle = 0;
var arc = Math.PI / (options.length / 2);
var spinTimeout = null;

var spinArcStart = 10;
var spinTime = 0;
var spinTimeTotal = 0;

var ctx;

var preguntas = [];

function loadQuestions() {
    preguntas.push({categoria: 'Hacoaj', texto: 'Hacoaj 1'});
    preguntas.push({categoria: 'Hacoaj', texto: 'Hacoaj 2'});
    
    preguntas.push({categoria: 'Ioia', texto: 'Ioia 1'});
    preguntas.push({categoria: 'Ioia', texto: 'Ioia 2'});
    
    preguntas.push({categoria: 'Cultura', texto: 'Cultura 1'});
    preguntas.push({categoria: 'Cultura', texto: 'Cultura 2'});
    
    preguntas.push({categoria: 'Random', texto: 'Random 1'});
    preguntas.push({categoria: 'Random', texto: 'Random 2'});
    
    preguntas.push({categoria: 'SciTech', texto: 'SciTech 1'});
    preguntas.push({categoria: 'SciTech', texto: 'SciTech 2'});
}

function byte2Hex(n) {
    var nybHexString = "0123456789ABCDEF";
    return String(nybHexString.substr((n >> 4) & 0x0F,1)) + nybHexString.substr(n & 0x0F,1);
}

function RGB2Color(r,g,b) {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
}

function getColor(item, maxitem) {
    var phase = 0;
    var center = 128;
    var width = 127;
    var frequency = Math.PI*2/maxitem;
    
    red   = Math.sin(frequency*item+2+phase) * width + center;
    green = Math.sin(frequency*item+0+phase) * width + center;
    blue  = Math.sin(frequency*item+4+phase) * width + center;
    
    return RGB2Color(red,green,blue);
}

function drawRouletteWheel() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var outsideRadius = 200;
        var textRadius = 160;
        var insideRadius = 125;

        ctx = canvas.getContext("2d");
        ctx.clearRect(0,0,500,500);

        ctx.font = "bold 20px sans-serif";
        
        ctx.shadowColor = 'black';
        ctx.shadowBlur = '2';
        ctx.shadowOffsetX = '0';
        ctx.shadowOffsetY = '2';

        for(var i = 0; i < options.length; i++) {
            var angle = startAngle + i * arc;
            //ctx.fillStyle = colors[i];
            ctx.fillStyle = getColor(i, options.length);

            ctx.beginPath();
            ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
            ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
            ctx.stroke();
            ctx.fill();

            ctx.save();
            ctx.fillStyle = "white";

            ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius, 
                            250 + Math.sin(angle + arc / 2) * textRadius);
            ctx.rotate(angle + arc / 2 + Math.PI / 2);
            var text = options[i].texto;
            ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
            ctx.restore();
        } 

        //Arrow
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
        ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.fill();
    }
}

function rotateWheel() {
    spinTime += 30;
    if(spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel();
    spinTimeout = setTimeout('rotateWheel()', 30);
}

function spin() {
    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3 + 4 * 1000;
    rotateWheel();
}

function mostrarPregunta(categoria){
    // alert(categoria.texto);
    const pregunta = siguientePregunta(categoria);
    if(pregunta){
        alert(pregunta.texto);
    }
}

function siguientePregunta(categoria){
    const preguntasCategoria =  preguntas.filter(preg => preg.categoria == categoria.nombre);
    const pregunta = preguntasCategoria[categoria.contador];
    eliminarPregunta(pregunta);
    quedanPreguntas(categoria);
    return pregunta;
}

function eliminarPregunta(pregunta){
    preguntas = preguntas.filter(preg => preg != pregunta);
}

function quedanPreguntas(categoria){
    if (!preguntas.some(preg => preg.categoria == categoria.nombre)) {
        options = options.filter(cat => cat != categoria);
        arc = Math.PI / (options.length / 2);
        drawRouletteWheel();
    }
}

function stopRotateWheel() {
    clearTimeout(spinTimeout);
    var degrees = startAngle * 180 / Math.PI + 90;
    var arcd = arc * 180 / Math.PI;
    var index = Math.floor((360 - degrees % 360) / arcd);
    ctx.save();
    ctx.font = 'bold 30px Helvetica, Arial';
    var categoria = options[index];
    mostrarPregunta(categoria);
    // ctx.fillText(text, 250 - ctx.measureText(text).width / 2, 250 + 10);
    ctx.restore();
}

function easeOut(t, b, c, d) {
    var ts = (t/=d)*t;
    var tc = ts*t;
    return b+c*(tc + -3*ts + 3*t);
}