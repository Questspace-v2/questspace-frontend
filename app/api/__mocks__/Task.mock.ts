import { ITask, ITaskGroup } from '@/app/types/quest-interfaces';

export const taskMock1: ITask = {
    correct_answers: [
        "string"
    ],
    hints_full: [
        {
            taken: false,
            text: "string"
        },
        {
            taken: false,
            text: "str"
        }
    ],
    id: "string",
    media_links: ["https://api.dicebear.com/7.x/thumbs/svg?seed=591f6fe1-d6cd-479b-a327-35f6b12a08fc"],
    name: "Канатная дорога",
    order_idx: 0,
    pub_time: "string",
    question: "В Нижнем Новгороде над Волгой в нулевые протянули канатную дорогу. Аналогичная конструкция, если мы прикроем глаза как младенцы, появилась в Екатеринбурге значительно раньше и кабель также прокинут над рекой. Что смертельно опасно делать в зоне нашей канатной дороги согласно табличке, расположенной на одной из опор?",
    reward: 300,
    verification: "auto"
}

export const taskMock2: ITask = {
    correct_answers: [
        "строка", "возможно"
    ],
    hints_full: [
        {
            taken: false,
            text: "string"
        },
        {
            taken: false,
            text: "string2"
        },
        {
            taken: false,
            text: "string3"
        }
    ],
    id: "string1337",
    media_links: [""],
    name: "Кто-то рождается, кто-то умирает",
    order_idx: 1,
    pub_time: "string",
    question: "На табличке церкви есть опечатка — кто-то пропустил букву и получилось рожество. Ошибка, возможно была фатальной — иначе как объяснить граффити с годами жизни, расположенное рядом. Назовите код, расположенный на перпендикулярной граффити поверхности",
    reward: 100,
    verification: "auto"
}

export const taskGroupMock: ITaskGroup = {
    id: "string",
    name: "Уралмаш",
    order_idx: 0,
    pub_time: "string",
    tasks: [taskMock1, taskMock2]
}
