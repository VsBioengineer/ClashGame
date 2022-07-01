using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication5.Models
{
    public class Entity
    {
        //Имя/тип существа
        public string TypeEntity { get;}
        //Здоровье
        public int HelthEntity { get; }
        //Атака
        public int AtackEntity { get; }
        //Дистанция
        public int DistanceAtackEntity { get; }
        //Скорость
        public int SpeedEntity { get; }
        //Стоимость
        public int PriceEntity { get; }
        //Карта в руке
        public string CardEntity { get; }

        //Конструктор для присвоения всех значений персонажу на этапе инициализации 
        public Entity(string nameType, int helth, int atack, int distance, int speed, int cost, string card)
        {
            TypeEntity = nameType;
            HelthEntity = helth;
            AtackEntity = atack;
            DistanceAtackEntity = distance;
            SpeedEntity = speed;
            PriceEntity = cost;
            CardEntity = card;
        }
    }
}
