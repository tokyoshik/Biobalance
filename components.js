// ТВОЙ КОНФИГ
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

// Исправленная инициализация для версии COMPAT
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

// Функция отрисовки
function renderLike() {
    console.log("Скрипт отрисовки запущен!");

    const containerHTML = `
    <div id="firebase-box" style="padding: 40px 10%; background: #fff; border-top: 2px solid #121212; text-align: center;">
        <button id="like-btn" style="background: #fff; border: 2px solid #121212; padding: 15px 30px; cursor: pointer; font-weight: 900; font-size: 18px;">
            ❤ ЛАЙК <span id="like-count">0</span>
        </button>
    </div>`;

    // Вставляем перед футером или в конец тела
    const footer = document.querySelector('footer');
    if (footer) {
        footer.insertAdjacentHTML('beforebegin', containerHTML);
    } else {
        document.body.insertAdjacentHTML('beforeend', containerHTML);
    }

    // Ссылка на конкретную страницу в базе
    const pageID = window.location.pathname.split("/").pop().replace(".html", "") || "index";
    const likeRef = db.ref('likes/' + pageID);

    // Слушаем изменения
    likeRef.on('value', (snapshot) => {
        const count = snapshot.val() || 0;
        const countSpan = document.getElementById('like-count');
        if (countSpan) countSpan.innerText = count;
    });

    // Клик
    document.getElementById('like-btn').onclick = () => {
        likeRef.transaction((current) => (current || 0) + 1);
    };
}

// Запуск
document.addEventListener("DOMContentLoaded", renderLike);
