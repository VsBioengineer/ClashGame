using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication5.Models
{
    public class AllPlayData
    {
        //Список существ
        public List<Entity> AllEntity { get; set; }
        //Текст меню, настроек, регистрации на разных языках
        public Language LanguagePlayer {get; set;}
        //Имя игрока
        public string PlayerName { get; set; }
        //Карта игрока
        public string PlayerMap { get; set; }
        //Опыт игрока
        public string PlayerExperience { get; set; }
        //Скорость игры
        public int PlayerSpeed { get; set; }

        //Метод получения рандомной карты сражений
        public string GetRandomMap()
        {
            string[] maps = {"forest", "desert", "hell" };
            Random rand = new Random();
            string result = maps[rand.Next(0, maps.Length)];
            return result;
        }
    }
}
