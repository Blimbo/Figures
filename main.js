const dotsArea = document.querySelector('.dotsArea');
const reset = document.querySelector('.reset');
const about = document.querySelector('.about');
const aboutInfo = document.querySelector('.info');
const dotsAreaInfo = document.querySelector('.dotsAreaInfo');
const dotsArray = [];
const dotsArrayLength = 3;

const dotColor = 'red';
const dotRadius = 11;
const parallelogramColor = 'blue';
const circleColor = 'yellow';


let drag = false;
let index = -1;
let square = 0;

dotsArea.width = window.innerWidth;
dotsArea.height = window.innerHeight;

dotsArea.addEventListener('mousedown', addDot);
dotsArea.addEventListener('mousemove', moveDot);
dotsArea.addEventListener('mouseup', stopDrag);

reset.onclick = function() {
    clearDotsArea();
    while (dotsArray.length > 0) {
        dotsArray.pop();
    }
};

about.onclick = function() {
    aboutInfo.classList.toggle('hide');
}

function moveDot(event) {
    if (drag) {
        let coord = [event.clientX, event.clientY];
        if (index === -1) {
            let distance;
            for (let i = 0; i < dotsArray.length && i < dotsArrayLength; i++) {
                distance = Math.sqrt(Math.pow(coord[0]-dotsArray[i][0], 2) + Math.pow(coord[1]-dotsArray[i][1], 2));
                if (distance < dotRadius) {
                    index = i;
                }
            }
        } else {
            dotsArray[index] = coord;
            clearDotsArea();
            draw();
        }
    }
}

function stopDrag() {
    drag = false;
    index = -1;
    draw();
}

function addDot (event) {
    drag = true;
    if (dotsArray.length < 3) {
        dotsArray.push([event.clientX, event.clientY]);
        index = dotsArray.length - 1;
        draw();
    }
}

function draw() {
    drawDots(dotsArray);
    if (dotsArray.length > 2) {
        addFourthDot(dotsArray);
        drawParallelogram(dotsArray);
        drawCircle(dotsArray);
        updateDotsAreaInfo(dotsArray);
    }
}

function drawDots(dots) {
    if (dotsArea.getContext) {
        let ctx = dotsArea.getContext('2d');
        ctx.beginPath();
        for (let i = 0; i < dots.length && i < dotsArrayLength; i++) {
            ctx.moveTo(dots[i][0] + dotRadius, dots[i][1]);
            ctx.arc(dots[i][0], dots[i][1], dotRadius, 0, 2*Math.PI);
        }
        ctx.strokeStyle = dotColor;
        ctx.stroke();
    }
}

function addFourthDot(dots){
    let coordX = dots[0][0] + (dots[2][0] - dots[1][0]);
    let coordY = dots[0][1] + (dots[2][1] - dots[1][1]);
    dots[dotsArrayLength] = [coordX, coordY];
}

function drawParallelogram(dots) {
    if (dotsArea.getContext) {
        let ctx = dotsArea.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(dots[dots.length-1][0], dots[dots.length-1][1]);
        for (let i = 0; i < dots.length; i++) {
            ctx.lineTo(dots[i][0], dots[i][1]);
        }
        ctx.strokeStyle = parallelogramColor;
        ctx.stroke();
    }
}

function drawCircle(dots) {
    if (dotsArea.getContext) {
        let ctx = dotsArea.getContext('2d');
        ctx.beginPath();
        let center = [(dots[0][0] + dots[2][0])/2, (dots[0][1] + dots[2][1])/2];
        square = parallelogramSquare(dotsArray);
        let radius = Math.sqrt(square/Math.PI);
        ctx.moveTo(center[0]+radius, center[1]);
        ctx.arc(center[0], center[1], radius, 0, 2*Math.PI);
        ctx.strokeStyle = circleColor;
        ctx.stroke();
    }
}

function parallelogramSquare(dots) {
    let vectorA = [dots[0][0] - dots[1][0], dots[0][1] - dots[1][1]];
    let vectorB = [dots[2][0] - dots[1][0], dots[2][1] - dots[1][1]];

    let lengthA = Math.sqrt(Math.pow(vectorA[0], 2) + Math.pow(vectorA[1], 2));
    let lengthB = Math.sqrt(Math.pow(vectorB[0], 2) + Math.pow(vectorB[1], 2));
    if (lengthA === 0 || lengthB === 0) {
        return 0;
    }

    let scalarAB = vectorA[0]*vectorB[0] + vectorA[1]*vectorB[1];
    
    let cos = scalarAB/(lengthA*lengthB);
    let sin = Math.sqrt(1 - Math.pow(cos, 2));
    
    return Math.round(lengthA*lengthB*sin);
}

function updateDotsAreaInfo(dots) {
    dotsAreaInfo.classList.remove('hide');
    dotsAreaInfo.innerText = 'coordinates of dots:\n'+
        '1. x: ' + dots[0][0] + ', y: ' + dots[0][1] + '\n' +
        '2. x: ' + dots[1][0] + ', y: ' + dots[1][1] + '\n' +
        '3. x: ' + dots[2][0] + ', y: ' + dots[2][1] + '\n' +
        'rectangle / circle square:\n' + 
        square + ' px squared';
}

function clearDotsArea() {
    dotsAreaInfo.classList.add('hide');
    let ctx = dotsArea.getContext('2d');
    ctx.clearRect(0, 0, dotsArea.width, dotsArea.height);
}