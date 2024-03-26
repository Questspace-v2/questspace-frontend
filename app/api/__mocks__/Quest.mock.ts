import { IQuest } from '@/app/types/quest-interfaces';
import userMock from '@/app/api/__mocks__/User.mock';

const questMock: IQuest = {
    access: 'public',
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
    media_link: "https://s3-alpha-sig.figma.com/img/8013/4f88/48cf6395a79537ed2057405c511d6cd9?Expires=1710720000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=iIVP1qa2YpJ0mQBAbmhraRJOxMkiwNVbVXnLWLHkAU~tF~tnBj62H~NhrOri1aYxsvmqyU2QjoL7~lvxTgF2ZqXpyPGX35s6BTgPBr7tb4jjh2AdfLBLIFwjrgRokEZQP4qGYhmgluRxoHMQr6a7-qXDRKuBknGGyXzzq7v7LliH~8CqPMU-4WyLttPQPtIOS3TpaI23g50GlczgHvnQFDW1Peqwgq0UU2hgAOImP3oT4qIldjkrQ7CntcsCGRvkA1RN~STCMrLPg7mTy466mnu8wEP2jcujuVXoaFqDlFZ~~bq6e6s5qpaDn4J2EBdJKk5p2~p~zAL-w0Z7RlRZ7g__",
    name: "Городской квест ДПММ",
    registration_deadline: "2021-02-11T21:54:42.123Z",
    start_time: "2021-02-18T11:54:42.123Z",
    status: "Завершен"
}

export default questMock;
