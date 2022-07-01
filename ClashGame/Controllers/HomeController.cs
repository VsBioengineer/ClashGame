using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using WebApplication5.Models;

namespace WebApplication5.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }












        //Метод обработки страницы Index
        public IActionResult Index()
        {
            /*
                Проверяем наши куки, в случае если есть запись "PLAYER_NAME" попадём на страницу Index
                В противном случае - откроем страницу регистрации Register
            */
            if (Request.Cookies["PLAYER_NAME"] !=null)
            {
                //Создаём экземпляр класса AllPlayData и заполняем его всеми нужными данными для игрока
                AllPlayData initAllDataPlayer = new AllPlayData();
                //Присвоение имени из куки
                initAllDataPlayer.PlayerName = Request.Cookies["PLAYER_NAME"];

                /*
                    Проверяем наши куки, в случае если запись "PLAYER_LANGUAGE" отсутствует
                    установим язык по умолчанию - "UA"
                    В противном случае - установим значение языка из куки
                */
                if (Request.Cookies["PLAYER_LANGUAGE"] == null)
                {
                    initAllDataPlayer.LanguagePlayer = new Language("UA");
                }
                else
                {
                    initAllDataPlayer.LanguagePlayer = new Language(Request.Cookies["PLAYER_LANGUAGE"]);
                }

                /*
                    Проверяем наши куки, в случае если запись "PLAYER_MAP" отсутствует
                    установим карту случайным образом 
                    В противном случае - установим карту из куки
                */
                if (Request.Cookies["PLAYER_MAP"] == null)
                {
                    initAllDataPlayer.PlayerMap = "random";
                }
                else
                {
                    initAllDataPlayer.PlayerMap = Request.Cookies["PLAYER_MAP"];
                }

                /*
                    Проверяем наши куки, в случае если запись "PLAYER_EXPERIENCE" отсутствует
                    установим наш опыт значение - 0 
                    В противном случае - установим опыт из куки
                */
                if (Request.Cookies["PLAYER_EXPERIENCE"] == null)
                {
                    initAllDataPlayer.PlayerExperience = "0";
                }
                else
                {
                    initAllDataPlayer.PlayerExperience = Request.Cookies["PLAYER_EXPERIENCE"];
                }

                /*
                    Отобразим страницу Index и передадим в неё наш экземпляр initAllDataPlayer,
                    где мы заполнили все данные для игры
                */
                return View("Index", initAllDataPlayer);
            }
            else
            {
                /*
                    Отобразим страницу Register и передадим в неё наш экземпляр ourlang,
                    с значением языка - UA
                */
                Language ourlang = new Language("UA");
                return View("Register", ourlang);
            }
        }


        //Метод обработки страницы Play 
        public IActionResult Play()
        {
            //Создаём экземпляр класса AllPlayData и заполняем его всеми нужными данными для игрока
            AllPlayData initAllDataPlayer = new AllPlayData();
            /*
                Проверяем наши куки, в случае если запись "PLAYER_MAP" отсутствует
                установим карту случайным образом 
                В противном случае - установим карту из куки
            */
            if (Request.Cookies["PLAYER_MAP"] == null || Request.Cookies["PLAYER_MAP"] == "random")
            {
                initAllDataPlayer.PlayerMap = initAllDataPlayer.GetRandomMap();
            }
            else
            {
                initAllDataPlayer.PlayerMap = Request.Cookies["PLAYER_MAP"];
            }
            //Присвоение имени из куки
            initAllDataPlayer.PlayerName = Request.Cookies["PLAYER_NAME"];
            //Присвоение списка бойцов с помощью экземпляра созданого по слабой ссылке класса AllEntity
            initAllDataPlayer.AllEntity = new AllEntity(initAllDataPlayer.PlayerMap).AllCreatures;
            //Присвоение скорости игры
            initAllDataPlayer.PlayerSpeed = 150;

            //Передаём наши данные на страницу Play и отображаем её
            return View(initAllDataPlayer);
        }


        //Метод обработки страницы Play с обработкой данных post запроса
        [HttpPost]
        public IActionResult Play(IFormCollection fromResulGame)
        {
            //проверяем наличие поля "experience" в переданной post запросом форме
            if (fromResulGame["experience"].Count > 0)
            {
                /*
                    Создадаём переменную типа int - для записи нового опыта

                    Для безопасности используем метод TryParse и пытаемся конвертировать 
                    значение поля "experience" 
                    В случае успешной конвертации int experience будет присвоино новое значение,
                    которое соответствует новому опыту, а в противоположном случае останется 0
                */

                int experience = 0;
                Int32.TryParse(fromResulGame["experience"], out experience);

                /*
                    Проверяем наши куки, в случае если запись "PLAYER_EXPERIENCE" присутствует
                    её нужно добавить к нашему новому опыту
                */
                if (Request.Cookies["PLAYER_EXPERIENCE"] != null)
                {
                    /*
                        Создадаём переменную типа int - для записи старого опыта

                        Для безопасности используем метод TryParse и пытаемся конвертировать 
                        значение куки "PLAYER_EXPERIENCE" 
                        В случае успешной конвертации int oldExperience будет присвоино новое значение,
                        которое соответствует старому опыту, а в противоположном случае останется 0.

                        Присвоение суммы старого и нового опыта 
                    */
                    int oldExperience = 0;
                    Int32.TryParse(Request.Cookies["PLAYER_EXPERIENCE"], out oldExperience);
                    experience += oldExperience;
                }
                //Записываем в куки "PLAYER_EXPERIENCE" = (наш опыт)
                Response.Cookies.Append("PLAYER_EXPERIENCE", experience.ToString());
            }
            //Переадресация на страницу Index
            return RedirectToAction("Index", "Home");
        }


        //Метод обработки страницы Config 
        public IActionResult Config()
        {
            //Создаём экземпляр класса AllPlayData и заполняем его всеми нужными данными для игрока
            AllPlayData initAllDataPlayer = new AllPlayData();

            /*
                Проверяем наши куки, в случае если запись "PLAYER_LANGUAGE" отсутствует
                установим язык по умолчанию - "UA"
                В противном случае - установим значение языка из куки
            */
            if (Request.Cookies["PLAYER_LANGUAGE"] == null)
            {
                initAllDataPlayer.LanguagePlayer = new Language("UA");
            }
            else
            {
                initAllDataPlayer.LanguagePlayer = new Language(Request.Cookies["PLAYER_LANGUAGE"]);
            }

            /*
                Проверяем наши куки, в случае если запись "PLAYER_MAP" отсутствует
                установим карту случайным образом 
                В противном случае - установим карту из куки
            */
            if (Request.Cookies["PLAYER_MAP"] == null)
            {
                initAllDataPlayer.PlayerMap = "random";
            }
            else
            {
                initAllDataPlayer.PlayerMap = Request.Cookies["PLAYER_MAP"];
            }
            //Передаём наши данные на страницу Config и отображаем её
            return View(initAllDataPlayer);
        }


        //Метод обработки страницы Config с обработкой данных post запроса
        [HttpPost]
        public IActionResult Config(IFormCollection languageform)
        {
            /*
                проверяем наличие поля "language" в переданной post запросом форме
                и в случае наличия - запишем в куки "PLAYER_LANGUAGE" = значение поля "language"
            */
            if (languageform["language"].Count > 0) 
                Response.Cookies.Append("PLAYER_LANGUAGE", languageform["language"]);

            /*
                проверяем наличие поля "language" в переданной post запросом форме
                и в случае наличия - запишем в куки "PLAYER_MAP" = значение поля "map"
            */
            if (languageform["map"].Count > 0) 
                Response.Cookies.Append("PLAYER_MAP", languageform["map"]);

            //Переадресация на страницу Config
            return RedirectToAction("Config", "Home");
        }


        //Метод обработки страницы Register с обработкой данных post запроса
        [HttpPost]
        public IActionResult Register(IFormCollection fromRegisration)
        {
            /*
                проверяем наличие поля "nikname" в переданной post запросом форме
                и в случае наличия - запишем в куки "PLAYER_NAME" = значение поля "nikname"
            */
            if (fromRegisration["nikname"].Count > 0)
            {
                Response.Cookies.Append("PLAYER_NAME", fromRegisration["nikname"]);
            }
            //Переадресация на страницу Index
            return RedirectToAction("Index", "Home");
        }



















        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
