/*Инициализация переменных и объектов: В данном коде объявляются переменные и объекты для работы с кодом,
изображениями и аудиофайлами, а также некоторыми элементами DOM.*/
let canvas = document.getElementById("canvas")
let context = canvas.getContext("2d")
let inputNew_name = document.getElementById('new_name')
let showName = document.getElementById('showName')
let showScore = document.getElementById('showScore')
let showNames = [];
let showScores = []

let boot = new Image()
let bird = new Image()
let background = new Image()
let foreground = new Image()
let pipeUp = new Image()
let pipeDown = new Image()
let sale_persent = new Image()
let game_lose = new Image()
let winner = new Image()
let upAudio = new Audio()
let pointsAudio = new Audio()
let score_for_sale = document.getElementById('score_of_fb')
let game_reload_btn = document.getElementById('game_reload_btn')

/*Обработчик события submit для формы: Данный код добавляет обработчик события submit на форму с id "username".
При отправке формы он предотвращает её действие по умолчанию (отправку) и обновляет содержимое элемента с id "showName"
значением, введённым в поле ввода с id "new_name".*/
const form = document.getElementById('username')
// Добавляем обработчик события submit на форму
form.addEventListener('submit', function (event) {
    event.preventDefault() // Предотвращаем отправку формы
    let playerName = inputNew_name.value // Получаем введенное имя из поля ввода
    // Обновляем содержимое элемента span с id "showName" новым именем
    showName.textContent = playerName
})

// Загрузка всех изображений и аудиофайлов для использования в игре
boot.src = "img_game/boot.png"
bird.src = "img_game/bird.png"
background.src = "img_game/background.png"
foreground.src = "img_game/fg.png"
pipeUp.src = "img_game/down.png"
pipeDown.src = "img_game/up.png"
sale_persent.src = "img_game/sale.png"
game_lose.src = "img_game/lose.png"
winner.src = "img_game/win.png"
upAudio.src = "audio_game/fly.mp3"
pointsAudio.src = "audio_game/score.mp3"

/*Основные переменные и инициализация игры: Здесь определены основные переменные, которые будут использоваться
во время игры, а также инициализируется массив pipes, содержащий объект с начальными координатами трубы.*/
let distance = 90;
let xb = 10;
let yb = 150;
let grav = 2;
let points = 0;

let pipes = [];
pipes[0] = {
    x: canvas.width,
    y: 0
}

/*Обработчик события нажатия клавиши 'W': Данный код добавляет обработчик события нажатия клавиши. Если нажата клавиша 'W',
 то значение yb (координаты по вертикали для изображения) уменьшается на 40, чтобы двигать персонажа вверх.*/
document.addEventListener('keydown', (e) => {
    console.log(e.code)
    if (e.code === 'KeyW') {
        yb -= 40;
    }
})

/*Обработчики событий для кнопок выбора персонажа: Эти обработчики событий позволяют выбирать персонажа
(boot или bird) для игры.*/
let currentPlayer = boot // По умолчанию выбран рисунок boot
document.getElementById('boot_btn').addEventListener('click', () => {
    currentPlayer = boot // Устанавливаем currentPlayer на boot после перезапуска
})

document.getElementById('bird_btn').addEventListener('click', () => {
    currentPlayer = bird // Устанавливаем currentPlayer на bird после перезапуска
})

function startGame() {
    // Запуск игры
    resetGame()
    draw()
}

window.onload = startGame

document.getElementById('game_reload_btn').addEventListener('click', function () {
    startGame()
})

let hasPassedPipe = false; // Флаг, который показывает, прошел ли персонаж трубу
function draw() {
    //console.log("In draw function")
    context.drawImage(background, 0, 0)
    context.drawImage(currentPlayer, xb, yb, 38, 26)
    //console.log("showNames:", showNames);
    //console.log("showScores:", showScores)
    for (let i = 0; i < pipes.length; i++) {
        // Проверяем, прошел ли персонаж через трубу и увеличиваем points только тогда
        if (xb === pipes[i].x && !hasPassedPipe) {
            points = points++;
            hasPassedPipe = true; // Устанавливаем флаг, чтобы не увеличивать points для одной трубы несколько раз
        }
        context.drawImage(pipeUp, pipes[i].x, pipes[i].y)
        context.drawImage(sale_persent, pipes[i].x, pipes[i].y + pipeUp.height + 15, 50, 50)
        context.drawImage(pipeDown, pipes[i].x, pipes[i].y + pipeUp.height + distance)
        pipes[i].x--;
        if (pipes[i].x == 125) {
            pipes.push({
                x: canvas.width,
                y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height
            })
        }
        if (xb + boot.width >= pipes[i].x && xb <= pipes[i].x + pipeUp.width &&
            (yb <= pipes[i].y + pipeUp.height || yb + boot.height >= pipes[i].y + pipeUp.height + distance) ||
            yb + boot.height >= canvas.height - foreground.height) {
            return context.drawImage(game_lose, 0, 0)
        }

        // Проверяем условия завершения игры (проигрыш или 20 очков)
        if (yb + boot.height >= canvas.height - foreground.height || points >= 20) {

            // Добавляем имя и результат в соответствующие массивы
            showNames.push(inputNew_name.value);
            showScores.push(points);

            // Обновляем содержимое элемента с классом "result" с новыми данными
            let resultDiv = document.querySelector('.result');
            // Очищаем содержимое элемента перед добавлением новых элементов из массива
            resultDiv.innerHTML = ''
            for (let i = 0; i < showNames.length; i++) {
                let resultItem = document.createElement('div');
                let nameSpan = document.createElement('span'); // Заменили 'showName' на 'span'
                nameSpan.textContent = 'Name: ' + showNames[i];
                let scoreSpan = document.createElement('span'); // Заменили 'showScore' на 'span'
                scoreSpan.textContent = 'Score: ' + showScores[i];
                let br = document.createElement('br');
                resultItem.appendChild(nameSpan);
                resultItem.appendChild(br);
                resultItem.appendChild(scoreSpan);
                resultItem.appendChild(br.cloneNode());

                // Добавляем каждый элемент результата в контейнер .result
                resultDiv.appendChild(resultItem);
            }

            if (points >= 20) {
                return context.drawImage(winner, 0, 0); // Добавляем изображение победы
            } else {
                return context.drawImage(game_lose, 0, 0); // Добавляем изображение поражения
            }
        }

        if (xb === pipes[i].x) {
            points++
        }
    }
    context.drawImage(currentPlayer, xb, yb, 38, 26);
    yb += grav
    context.drawImage(foreground, 0, canvas.height - foreground.height)
    requestAnimationFrame(draw)
    context.fillStyle = "#ffd359"
    context.font = "24px Verdana"
    context.fillText(points, 10, canvas.height - 23)
    context.drawImage(sale_persent, 40, canvas.height - 45, 24, 24)
    // Обновляем содержимое элемента span с id "showScore" результатом достижения (переменная points)
    showScore.textContent = points
}

function resetGame() {
    // Обнуление переменных и состояний игры
    distance = 90
    xb = 10
    yb = 150
    grav = 2
    points = 0
    pipes = []
    pipes[0] = {
        x: canvas.width,
        y: 0
    }
    hasPassedPipe = false; // Сбрасываем флаг, чтобы персонаж мог снова проходить через трубу и увеличивать points
}







