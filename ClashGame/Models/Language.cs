using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication5.Models
{
    public class Language
    {
        //Язык
        public string ChoiseLang { get; }

        //Текст на странице меню
        public string Play {get;}
        public string Config {get;}

        //Текст на странице регистрации
        public string RegistrationText {get;}
        public string RegistrationField {get;}
        public string RegistrationSend {get;}

        //Текст на странице настроек
        public string ConfigLangText {get;}
        public string ConfigMapText {get;}
        public string ConfigBackText { get; }

        //Текст - назад
        public string Back {get;}

        //Конструктор для присвоения всех значений текста на этапе инициализации 
        public Language(string namelang)
        {
            ChoiseLang = namelang;

            /*
                Проверка языка и присвоение значений всем свойствам
                Для UA - инициировать все поля на украинском
                Для EN - инициировать все поля на английском
                Для DE - инициировать все поля на немецком
                
            */
            if (namelang == "UA")
            {
                Play = "Грати";
                Config = "Налаштування";

                RegistrationText = "Гравець, введи своє ім'я";
                RegistrationField = "Ваш нікнейм";
                RegistrationSend = "Надіслати";

                ConfigLangText = "Налаштування мови";
                ConfigMapText = "Вибір карти";
                ConfigBackText = "Назад до меню";

                Back = "Назад";
            }
            else if(namelang == "EN")
            {
                Play = "Play";
                Config = "Settings";

                RegistrationText = "Player, enter your name";
                RegistrationField = "your nickname";
                RegistrationSend = "Send";

                ConfigLangText = "Language settings";
                ConfigMapText = "Choice of map";
                ConfigBackText = "Back to main menu";

                Back = "Back";
            }
            else if (namelang == "DE")
            {
                Play = "Abspielen";
                Config = "Einstellungen";

                RegistrationText = "Spieler, gib deinen Namen ein";
                RegistrationField = "Dein Spitzname";
                RegistrationSend = "Senden";

                ConfigLangText = "Spracheinstellungen";
                ConfigMapText = "Kartenauswahl";
                ConfigBackText = "Zurück zum Hauptmenü";

                Back = "Zurück";
            }
        }
    }
}
