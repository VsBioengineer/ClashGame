using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication5.Models
{
    public class AllEntity
    {
        //Список всех существ
        public List<Entity> AllCreatures { get; }

        public AllEntity(string field)
        {
            //Инициализируем новый список существ
            AllCreatures = new List<Entity>();

            //Добавляем к списку существо - (замок, его здоровье, атака, дальность, скорость, стоимость, карта )
            AllCreatures.Add(new Entity("Castle", 3000, 50, 110, 0, 0, ""));

            //Если карта - лес
            if(field == "forest")
            {
                //Добавляем к списку существ (имя, здоровье, атака, дальность, скорость, стоимость, карта)
                AllCreatures.Add(new Entity("Warrior", 900, 63, 60, 3, 10, "first-card"));
                AllCreatures.Add(new Entity("Fairy", 173, 25, 120, 5, 20, "second-card"));
                AllCreatures.Add(new Entity("Assasin", 700, 160, 30, 8, 30, "third-card"));
                AllCreatures.Add(new Entity("Dragon", 1000, 60, 80, 3, 40, "forth-card"));
                AllCreatures.Add(new Entity("Slice", 440, 30, 110, 3, 50, "fifth-card"));
                AllCreatures.Add(new Entity("Paladin", 2250, 50, 50, 2, 60, "sixth-card"));
            }
            //Если карта - пустыня
            else if (field == "desert")
            {
                //Добавляем к списку существ (имя, здоровье, атака, дальность, скорость, стоимость, карта)
                AllCreatures.Add(new Entity("Warrior", 650, 63, 60, 2, 10, "first-card"));
                AllCreatures.Add(new Entity("Fairy", 153, 35, 100, 5, 20, "second-card"));
                AllCreatures.Add(new Entity("Assasin", 700, 160, 30, 6, 30, "third-card"));
                AllCreatures.Add(new Entity("Dragon", 850, 60, 80, 3, 40, "forth-card"));
                AllCreatures.Add(new Entity("Slice", 250, 30, 110, 1, 50, "fifth-card"));
                AllCreatures.Add(new Entity("Paladin", 1600, 50, 50, 1, 60, "sixth-card"));
            }
            //Если карта - ад
            else if (field == "hell")
            {
                //Добавляем к списку существ (имя, здоровье, атака, дальность, скорость, стоимость, карта)
                AllCreatures.Add(new Entity("Warrior", 500, 73, 50, 2, 10, "first-card"));
                AllCreatures.Add(new Entity("Fairy", 100, 15, 110, 3, 20, "second-card"));
                AllCreatures.Add(new Entity("Assasin", 500, 190, 30, 7, 30, "third-card"));
                AllCreatures.Add(new Entity("Dragon", 1200, 60, 50, 2, 40, "forth-card"));
                AllCreatures.Add(new Entity("Slice", 200, 30, 110, 2, 50, "fifth-card"));
                AllCreatures.Add(new Entity("Paladin", 1800, 50, 50, 1, 60, "sixth-card"));
            }
        }
    }
}
