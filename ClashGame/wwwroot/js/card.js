//Переменные для записи манны и здоровья
var manna = 0;
var helth;

//Загрузка страницы
window.onload = PageLoad;
function PageLoad() {
    InitCard();
    InitCastle();
}

//Функция, которая задаёт все события и подвижность для карт на руках 
function InitCard() {
    //Переменные элемента, положения и угла карты
    var card;
    var cardY;
    var cardIndex;
    var cardAngle;

    //Делаем все карты подвижными для мышки и тачскрина
    var $allCard = $('.card').draggabilly({})

    //Событие нажатия на карту
    $allCard.on('pointerDown', function (event) {
        //Присваиваем новые значени для наших переменных
        card = $(event.target);
        cardY = card.css("top");
        cardIndex = card.css("z-index");
        cardAngle = card.css("transform");

        /*
            Задаём увеличиный размер карты (150%) (в момент нажатия)
            Передвигаем карту на передний план
            Выдвигаем её немного для удобного просмотра
        */
        card.css("transform", "scale(1.5)")
            .css("z-index", "1000")
            .css("top", "-10vh");

        //Делаем поле для вставки бойцов видимым
        $(".allow").css("opacity", "1");
    })


    //Событие передвижения карты
    $allCard.on('pointerMove', function () {
        /*
            Задаём нормальный размер карты (100%)
            Делаем её некликабельной
            возвращяем изначальный сдвиг по Y
        */
        card.css("transform", "scale(1)")
            .css("pointer-events", "none")
            .css("top", cardY);
    })

    //Событие отпускания карты
    $allCard.on('pointerUp', function (event, pointer) {
        /*
            Для компов

            Проверяем наличие класса .allow
            Если он есть значит мышка была отпущена на поле вставки бойца
        */
        if ($(pointer.target).hasClass("allow")) {
            //Узнаём какого типа был боец на карте
            let typeFighter = card.children().attr("id");
            //Находим его в массиве переданом из модели
            let fighter = dataFighters.find((fighter) => fighter.typeEntity == typeFighter);
            //Узнаём стоимость бойца
            let cost = fighter.priceEntity
            //Если от манны отнять стоимость должно быть 0 или больше
            if (manna - cost >= 0) {
                //снимаем показатели манны
                manna -= cost;
                //ставим бойца на поле "your-warriors"
                CreateFighter("your-warriors", fighter, event.clientX, event.clientY, 1);
            }
        }
        /*
            Для телефонов
        */
        else {
            try {
                /*
                    Получаем координаты тачскрина
                    X
                    Y
                 */
                let xClickTouch = event.changedTouches[0].clientX;
                let yClickTouch = event.changedTouches[0].clientY;
                //Если координаты тачскрина будут всредине координат поля вставки бойцов - можем ставить
                if (gameInit.top < yClickTouch && gameInit.bottom > yClickTouch) {
                    if (gameInit.left < xClickTouch && gameInit.right > xClickTouch) {
                        //Узнаём какого типа был боец на карте
                        let typeFighter = card.children().attr("id");
                        //Находим его в массиве переданом из модели
                        let fighter = dataFighters.find((fighter) => fighter.typeEntity == typeFighter);
                        //Узнаём стоимость бойца
                        let cost = fighter.priceEntity
                        //Если от манны отнять стоимость должно быть 0 или больше
                        if (manna - cost >= 0) {
                            //снимаем показатели манны
                            manna -= cost;
                            //ставим бойца на поле "your-warriors"
                            CreateFighter("your-warriors", fighter, xClickTouch, yClickTouch, 1);
                        }
                    }
                }
            }
            catch {}
        }
        //Сохраняем как в переменную посленюю карту
        let lastcard = card;
        /*
            Задаём скорость изменения - 500 мс
            задаём нормальный размер
            передвигаем карту на задний план
            задаём угол поворота карты
            возвращяем карту на её позицию до нажатия (обратно в руку)
            возвращяем изначальный сдвиг по Y
        */
        lastcard.css("transition", "0.5s")
            .css("transform", "scale(1)")
            .css("z-index", cardIndex)
            .css("transform", cardAngle)
            .draggabilly('setPosition')
            .css("top", cardY);


        //Ждём 500 мс (пока карта вернётся в руку)
        setTimeout(function defaultseting() {
            /*
                Задаём скорость изменения - 0 мс
                Делаем клибальной
            */
            lastcard.css("transition", "0s")
                .css("pointer-events", "auto");
        }, 500);
        //Скрываем поле вставки бойцов
        $(".allow").css("opacity", "0");
    })
}
//Функция, которая установит замки на поле
function InitCastle() {
    //Берём 10% от высоты 
    let YLine = gameSize.bottom * 0.1;
    //Делим ширину поля на 2 - это центр
    let XLine = (gameSize.right - gameSize.left) / 2;
    //Нам нужно получить данные бойца
    let fighter = dataFighters.find((fighter) => fighter.typeEntity == "Castle");
    //Устанавливаем значение жизни для дальнейшего вычисления и отображения нашей жизни
    helth = fighter.helthEntity;
    //Создаём наш замок
    CreateFighter("your-warriors", fighter, gameSize.left + XLine - 50, gameSize.bottom - YLine, 1);
    //Создаём вражеский замок
    CreateFighter("enemy-warriors", fighter, gameSize.left + XLine + 50, YLine, -1);
}







//функция создания бойцов на поле
function CreateFighter(fieldID, fighter, X, Y, direction) {
    //функция создания изображения конкретного бойца
    function CreateIMG(typeFighter) {
        //создаём новое изображение
        let person = document.createElement('img');
        //задаём ему путь к изображению персонажа
        person.setAttribute("src", "../img/entity/" + typeFighter + ".png");
        //возвращяем
        return person;
    }
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
    //Получаем тип бойца
    let typeFighter = fighter.typeEntity;
    //Создаём его тег
    let createBones = document.createElement("div");
    //запаковываем в него картинку
    createBones.appendChild(CreateIMG(typeFighter));
    //Присваиваем класс, он также равен типу бойца
    createBones.classList = typeFighter;
    
    //Тег для пуль, магии, огня и прочего, что может кинуть этот боец
    let createSplash = document.createElement("div");
    //Класс для тега с магией, пулями...
    createSplash.classList = "splash";


    //Создаём элемент в который упакуем бойца и его тег с магией, пулями...
    let createFighter = document.createElement("div");
    //Пакуем бойца
    createFighter.appendChild(createBones);
    //Пакуем его магию....
    createFighter.appendChild(createSplash);
    //Добавляем класс 
    createFighter.classList = "Fighter";
    
    //Добавляем это в поле указанное нами при вызове функции 
    document.getElementById(fieldID).appendChild(createFighter);
    //Проверяем размер - на компьютере нужно учесть отступ
    if (gameSize.left > 0) X = (X - gameSize.x);
    //Ставим бойца в указаных нами координатах по Х
    createFighter.style.left = (X - 50) + "px";
    //Ставим бойца в указаных нами координатах по У
    createFighter.style.top = (Y - 50) + "px";
    //Задаём ему размер
    createFighter.style.transform = Sizer(Y, direction);
}








//Задаём интервал обработки по скорости игры
setInterval(function GameTimer() {
    //Пока игра не закончена или не поставлена на паузу
    if (gameEnd == false) {
        //Отображаем и начисляем манну (В скобочках количество), а также красит карты
        Manna(1);
        //Отображаем наше здоровья и проверка здоровья вражеского замка
        Helth();
        //Заставляем противника ставить бойцов
        EnemySetFighter();
    }
}, gameTime);

//Функция отображения и добавления манны
function Manna(pluser) {
    //Если манна меньше 100 можем добавить указаное значение
    if (manna < 100) manna += pluser;
    //Узнаём пропорцию
    let props = 180 / 100;
    //По пропорции ставим угол для манны
    let show = -180 + (manna * props);
    $(".manna").css("transform", "rotate(" + show + "deg)");

    //для каждого существа в модели
    dataFighters.forEach((dataAbout) => {
        //Если указана карта - продолжаем (У замка не указана)
        if (dataAbout.cardEntity != "") {
            //Если стоимость установки бойца ниже чем текущее значение манны - делаем цветным
            if (dataAbout.priceEntity < manna) {
                $("." + dataAbout.cardEntity).removeClass("gray");
            }
            //Иначе - сделаем карту серой
            else {
                $("." + dataAbout.cardEntity).addClass("gray");
            }
        }
    });
}
//Функция для обработки жизни
function Helth() {
    //Функция получения рандомного значения в пределах от и до
    function RandomFromTo(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    //Находим в ГЛОБАЛЬНО - наши массивы с бойцами и там находим идентефикаторы фражеского и своего замка
    let ENEMY = EnemyFighters.find((fighter) => fighter.id == "MAIN_enemy-warriors");
    let YOU = YourFighters.find((fighter) => fighter.id == "MAIN_your-warriors");

    //Получаем процент здоровья от 0 до 1
    let currentHelth = YOU.helth / helth;
    let show;
    //Здоровье не может быть отрицательным
    if (currentHelth >= 0) {
        //задаём угол поворота
        show = -180 + (currentHelth * 180);
    }
    else {
        //задаём угол поворота для жизни
        show = -180;
    }
    //Присваиваем угол поворота жизни
    $(".helth").css("transform", "rotate(" + show + "deg)");

    //Проверка жизни (Если у кого-то ноль или меньше игра закончится)
    if (ENEMY.helth <= 0 || YOU.helth <= 0) {
        //Пол-секунды драматического отступления и осознания никому не повредят
        setTimeout(function GameTimer() {
            //Останавливаем игру
            gameEnd = true;
            //Поднимаем форму переадрисации на главную страницу
            $(".result").css("top", "0");
            //Проверяем кто конкретно победил
            if (ENEMY.helth < YOU.helth <= 0) {
                //Пишем результат
                $("#result").html("DEFEAT");
            }
            else {
                //Получаем случайное число балов от победы
                //Можно придумать свою оценку (по времени, количеству выброшеных карт, количечеству бойцов...)
                let exp = RandomFromTo(30, 100);
                //Выводим это значение в видимую область
                $(".experience span").html(exp);
                //Записываем в скрытый инпут в форме
                $(".experience").val(exp);
                //Пишем результат
                $("#result").html("VICTORY");
            }
        }, 500);
    }
    
}

//Функция установки бойцов противником
function EnemySetFighter() {
    //Функция рандома (от и до)
    function RandomFromTo(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
    //Функция выбора случайного бойца
    function RandomFighter() {
        //Массив бойцов (колода)
        let enemyFighters = ["Warrior", "Fairy", "Dragon", "Assasin", "Slice", "Paladin"];
        //Размер колоды
        let koloda = enemyFighters.length;
        //Рандомный боец из этой колоды
        let result = enemyFighters[RandomFromTo(0, koloda)]
        return result;
    }
    //Если случайное число больше 97, то противник поставит бойца
    if (RandomFromTo(0, 100) > 97) {
        //10% от высоты поля боя (наша координа У)
        let borderField = gameSize.bottom * 0.1;
        //Случайный боец из колоды
        let typeFighter = RandomFighter();
        //Получить этого случайного бойца со всеми характеристиками
        let fighter = dataFighters.find((fighter) => fighter.typeEntity == typeFighter);
        //Высчитать рандомное положение (наша координата Х)
        //высчитываем ширину поля вставки бойцов делим на 100 и умножаем на рандомное число от 10 и до 90
        //В итоге получим координату Х с положением от 10% до 90% (чтобы не сильно по краям)
        let field = (gameSize.right - gameSize.left) / 100 * RandomFromTo(10, 90);
        //Создадим бойца на вражеском поле по координатам Х У
        CreateFighter("enemy-warriors", fighter, gameSize.left + field, borderField + 60, -1);
    }
}
