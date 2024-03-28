import { IQuest } from '@/app/types/quest-interfaces';
import userMock from '@/app/api/__mocks__/User.mock';

const questMock: IQuest = {
    access: "public",
    creator: userMock,
    description: "Объехал весь Екатеринбург во время видеомарафона? Пора рассмотреть все детали этого города! Городской квест дпмм возвращается уже в эти выходные! \n" +
        "\n" +
        "**Старт**: 19 сентября, 15:00 (!) перенесли дату, чтобы не мокнуть под дождем в воскресенье \n" +
        "**Где**: Заоперный \n" +
        "\n" +
        "**Телеграм-канал квеста:** [t.me/questdpmm2020](https://t.me/questdpmm2020)",
    finish_time: "2021-02-18T21:54:42.123Z",
    id: "b5ee72a3-54dd-c4b8-551c-4bdc0204cedb",
    max_team_cap: 5,
    media_link: "https://api.dicebear.com/7.x/thumbs/svg?seed=591f6fe1-d6cd-479b-a327-35f6b12a08f4",
    name: "Городской квест ДПММ",
    registration_deadline: "2021-02-11T21:54:42.123Z",
    start_time: "2021-02-18T11:54:42.123Z",
    status: "FINISHED"
}

export default questMock;
