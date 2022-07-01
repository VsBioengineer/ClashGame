//Переводим наше значение времени и объявляем наши переменные для смены переменных
var timeString = (gameTime / 1000) + "s";
var borderField;
var halfField

//Ждём загрузки документа
$(document).ready(function () {
    //Указываем самую высокую координату У
    borderField = gameSize.bottom * 0.1;
    //Указываем самую низкую координату У
    halfField = (gameSize.right - gameSize.left) / 2 - 50;

    //Задаём интервал обработки по скорости игры
    setInterval(function GameTimer() {
        //Проверка на паузу или конец игры
        if (gameEnd == false) {
            //Первым ходит противник
            CalculateBoard("enemy-warriors", EnemyFighters, YourFighters, -1);
            //Теперь ходим мы
            CalculateBoard("your-warriors", YourFighters, EnemyFighters, 1);
        }
    }, gameTime);
});

//функция для определения текущего размера исходя из положения 
function Sizer(Y, direction) {
    //Округление
    function rounded(number) {
        return +number.toFixed(2);
    }
    //Подсчёт текущего размера - 0.7 - минимальный размер + процент от высоты по Y на поле боя
    let size = (rounded(Y / gameSize.bottom, -1) * 0.5) + 0.7;
    //Для удобства сразу приводим в нужный вид
    let result = "scale(" + (size * direction) + ", " + size + ")";
    //Возвращяем
    return result;
}






//Функция поиска ближайшего противника 
function FindEnemy(fighterX, fighterY, distance, matrix) {
    //Высчитываем точные координаты положения 
    let X = fighterX + 50;
    let Y = fighterY + 50;
    let nearestEnemy = 10000;
    let indexEnemy = -1;

    //увеличиваем область атаки по бокам (-50, 0, 50)
    //Таким образом у нас 3 варианта координат
    let region = [X - 50, X, X + 50];
    //Для каждого из этих вариантов мы проверяем условия 
    region.forEach((X_region) => {
        //Матрица бойцов - листаем всех
        matrix.forEach((fighter, index) => {
            //Его расстояние к боевой едине вычислим с помощью вектора
            let XV = Math.pow((fighter.X + 50) - X_region, 2);
            let YV = Math.pow((fighter.Y + 50) - Y, 2);
            let vector = Math.sqrt(XV + YV);
            //Если вектор больше дистанции, то по условию отпадает
            //Если меньше дистанции и меньше чем предыдущий вариант присваиваем индекс из массива
            if (vector < nearestEnemy && vector <= distance) {
                nearestEnemy = vector;
                indexEnemy = index;
            }
        });
    });
    return indexEnemy;
}

//Функция хода
function CalculateBoard(board, yourMatrix, enemyMatrix, direction) {
    //Получаем элемент поля и выполняем определённые действия для каждого дочернего элемента 
    $("#" + board + " .Fighter").each(function () {
        //Получаем изображение
        let svg = $(this).children().children();
        //Получаем тип бойца
        let typeFighter = $(this).children().attr("class");
        //Получаем все характеристики бойца
        let info = dataFighters.find((fighter) => fighter.typeEntity == typeFighter);
        //Получаем координаты элемента
        let move = $(this).position();
        //Получаем его идентификатор
        let identificator = svg.attr("id");


        //В случае отсутсвия индетификатора
        if (identificator === undefined) {
            
            //Создаём уникальный идентификатор
            let nummerID = $("#" + board).children().length;
            let curentTime = (new Date()).getMilliseconds() + "" + (new Date()).getSeconds();
            let newID;

            //В случае замка - дадим конкретный 
            if (typeFighter == "Castle") { newID = "MAIN_" + board; }
            //Иначе - сделаем уникальным
            else { newID = "EL_" + nummerID + "_" + curentTime; }

            //Добавим к массиву нового бойца и его характеристики
            yourMatrix.push({
                id: newID,
                type: typeFighter,
                helth: info.helthEntity,
                atack: info.atackEntity,
                distance: info.distanceAtackEntity,
                speed: info.speedEntity,
                X: move.left,
                Y: move.top
            });
            //Присвоение идентификатора
            svg.attr("id", newID);
            //Задаём скорость изменения 
            $(this).css("transition", timeString);
        }
        //В случае наличия идентификатора
        else {
            //Находим его в массиве
            let indexCurrentFighter = yourMatrix.findIndex((fighter) => fighter.id == identificator);
            //Находим координату Х
            let Fighter_X = yourMatrix[indexCurrentFighter].X;
            //Находим координату У
            let Fighter_Y = yourMatrix[indexCurrentFighter].Y;
            //Находим скорость
            let Fighter_S = yourMatrix[indexCurrentFighter].speed;
            //Находим здоровье
            let Fighter_H = yourMatrix[indexCurrentFighter].helth;
            //Находим дистанцию
            let Fighter_D = yourMatrix[indexCurrentFighter].distance;
            //Находим атаку
            let Fighter_A = yourMatrix[indexCurrentFighter].atack;


            //Если здоровье больше 0, то боец живой
            if (Fighter_H > 0) {
                //Поиск ближайшей для атаки боевой единицы соперника
                let atack = FindEnemy(Fighter_X, Fighter_Y, Fighter_D, enemyMatrix);
                //Если она отсутствует (будет -1)
                if (atack == -1) {
                    //Присваиваем координату У 
                    let newpositionY = Fighter_Y - (Fighter_S * direction);
                    //Присваиваем координаты Х
                    let newpositionX = Fighter_X;
                    //Если координата У больше или меньше максимальной У
                    if (newpositionY < borderField || newpositionY > (gameSize.bottom - borderField)) {
                        //Проверяем справа или слева от центра находится координата Х
                        if (Fighter_X > halfField) {
                            //Если справа, то отнимаем 
                            newpositionX = Fighter_X - Fighter_S;
                            //Обновляем информацию о положении координаты Х в массиве
                            yourMatrix[indexCurrentFighter].X = newpositionX;
                        }
                        else {
                            //Если слева, то добавляем
                            newpositionX = Fighter_X + Fighter_S;
                            //Обновляем информацию о положении координаты Х в массиве
                            yourMatrix[indexCurrentFighter].X = newpositionX;
                        }
                    }
                    else {
                        //Обновляем информацию о положении координаты У в массиве
                        yourMatrix[indexCurrentFighter].Y = newpositionY;
                        //Изминения размера
                        $(this).css("transform", Sizer(move.top, direction));
                    }
                    //Перемещение элемента
                    $(this).css({ top: newpositionY, left: newpositionX });

                }
                else {
                    //Обновляем информацию о здоровье вражеской единицы
                    enemyMatrix[atack].helth -= Fighter_A;
                }
            }
            //Если здоровья меньше
            else {
                //Удаляем с поля боя
                $(this).remove();
                //Удаляем из массива
                if (typeFighter != "Castle")
                    yourMatrix.splice(indexCurrentFighter, 1);
            }
        }
    });
}