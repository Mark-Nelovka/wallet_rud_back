/*
Извлекает токен из заголовка и:
1. Проверяет валидность токена (то есть что мы его выдали и он не истек).
2. Извлекает из токена id, находит пользователя в базе по id и прикрепляет его 
к запросу (req.user).
*/
const { Unauthorized } = require("http-errors");
// ми створювали токен за допомогою джт -токена і перевіряти будемо за допомогою цієї ж бібліоткеи, імпортуємо її
const jwt = require("jsonwebtoken");
// ця мідлвара виконує кілька задач:
// 1. перевіряє валідність токена, тобто що ми його видали та що його термін не витік
// 2. витягує з токена айді, знаходить в базі користувача по айді і прикріплює його до запиту (рег.юзер)
// таким чином в любому контролері інфор про того хто питає буде доступна
const { User } = require("../models");
// витягуємо секретний ключ щоб розшифрувати токен
const { SECRET_KEY } = process.env;
/*
1. Извлечь из заголовков запроса содержимое заголовка Authorization.
2. Разделить его на 2 слова: bearer и токен.
3. Проверить равно ли первое слово "Bearer".
4. Проверить валидность второго слова (токен).
5. Если токен валиден - извлечь из него id и найти пользователя в базе 
с таким id.
6. Если пользователя с таким id мы нашли в базе - его нужно 
прикрепить к запросу (объект req).
*/
const auth = async (req, res, next) => {
  // витягуємо заголовок - всі заголовки зберігаються в реквест хедерс - з малеенької літери
  // якщо його не передали, (то викине андефайнд, до нього не можна застосуввати спліт, тому буде помилка),  -присваюємо пустий рядок
  const { authorization = "" } = req.headers;
  // тепер цей рядок треба розділити на 2 частини по пробелу, для цого використовуємо спліт
  // робимо деструктуризацію - в змінну берер повинно попасти слово - берез з великої літери, в змінну токе = сам токен
  const [bearer, token] = authorization.split(" ");

  try {
    // робимо перевірку на слово берер, якщо не = викидаємо помилку = не авторизованийз пакету шттп-ерорз - 401 конструктор - анавторайз, імпортуємо його
    if (bearer !== "Bearer") {
      throw new Unauthorized("Not authorized");
    }
    // перевірка за допомогою метода веріфай, передаємо йому 1 аргументом токен, а 2 -секретний ключ, але веріфай не присваює статус помилці, тому ми обертаємо в трай-кетч і викидаємо нову помилку із статусом 401
    // витягуємо саме id, а не _id, бо при створенні ми його так назвали,
    // якщо він є, то знаходимо користувача в базі за допомогою юзера,
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    // якщо цого немає - викидаємо помилку
    // дописуємо ще перевірку - якщо користувач був, але розлогінився, тобто його токен став нал, то викидаємо помилку
    if (!user || !user.token) {
      throw new Unauthorized("Not authorized");
    }
    //  якщо є  - прикріпляємо в реквест юзер - юзера і передаємо управління далі - некст
    req.user = user;
    next();
  } catch (error) {
    if (error.message === "Invalid sugnature") {
      error.status = 401;
    }
    next(error);
    // throw error;
  }
};
module.exports = auth;
// цю мідлвару можна імпортувати в будь=яке місце - в товари, чи ще кудись, таким чином ми отримаємо приватний роутер