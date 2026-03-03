// 1. ПРОВЕРКА В КОНСОЛИ
console.log("HealthLogic: Файл components.js успешно прочитан браузером!");

// 2. ТВОЙ КОНФИГ

const firebaseConfig = {
  apiKey: "AIzaSyBgjwzfctB0Z9Lyak4WXTo_wxb2vS5L-rs",
  authDomain: "healthlogic-fe5bd.firebaseapp.com",
  projectId: "healthlogic-fe5bd",
  storageBucket: "healthlogic-fe5bd.firebasestorage.app",
  messagingSenderId: "177114233773",
  appId: "1:177114233773:web:0e341fb52efcf7dc2cff24"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 3. БЕЗОПАСНАЯ ИНИЦИАЛИЗАЦИЯ
// Мы проверяем наличие объекта firebase, чтобы не было ошибки ReferenceError
if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    console.log("HealthLogic: Firebase готов к работе!");
} else {
    console.error("HealthLogic: Ошибка! Firebase не загружен. Проверь порядок скриптов в HTML.");
}

// 4. ФУНКЦИЯ ОТРИСОВКИ (Она создаст кнопку на любой странице)
function initLikes() {
    // Проверяем, есть ли на странице место для вставки (например, футер)
    const footer = document.querySelector('footer');
    
    // Создаем элемент лайков
    const likeSection = document.createElement('div');
    likeSection.id = "dynamic-like-section";
    likeSection.style.cssText = "padding: 40px 10%; text-align: center; background: #fff; border-top: 2px solid #000; margin-top: 20px;";
    
    likeSection.innerHTML = `
        <button id="btn-like" style="background: #000; color: #fff; border: none; padding: 15px 35px; font-weight: 900; cursor: pointer; font-size: 18px;">
            ❤ ЛАЙК <span id="like-count-val">0</span>
        </button>
    `;

    // Вставляем кнопку
    if (footer) {
        footer.before(likeSection);
    } else {
        document.body.appendChild(likeSection);
    }

    // Подключаем базу
    const pageID = window.location.pathname.split("/").pop().replace(".html", "") || "index";
    const db = firebase.database();
    const likeRef = db.ref('likes/' + pageID);

    // Слушаем количество лайков
    likeRef.on('value', (snap) => {
        const count = snap.val() || 0;
        const countSpan = document.getElementById('like-count-val');
        if (countSpan) countSpan.innerText = count;
    });

    // Обработка клика
    document.getElementById('btn-like').onclick = function() {
        likeRef.transaction(c => (c || 0) + 1);
    };
    
    console.log("HealthLogic: Кнопка лайка отрисована!");
}

// ЗАПУСК
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLikes);
} else {
    initLikes();
}
