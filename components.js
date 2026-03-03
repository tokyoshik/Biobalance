console.log("HealthLogic: components.js загружен!");

// 1. ТВОЙ КОНФИГ

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

// 2. ИНИЦИАЛИЗАЦИЯ (ИСПРАВЛЕННАЯ СТРОКА 15)
// Добавили "firebase.", чтобы убрать ReferenceError
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// 3. ФУНКЦИЯ ОТРИСОВКИ
function renderLikeSection() {
    const pageID = window.location.pathname.split("/").pop().replace(".html", "") || "index";
    
    // Создаем блок лайка
    const section = document.createElement('div');
    section.style.cssText = "padding: 50px 10%; text-align: center; background: #fff; border-top: 2px solid #000; position: relative; z-index: 9999;";
    section.innerHTML = `
        <button id="main-like-btn" style="background: #000; color: #fff; border: none; padding: 15px 35px; font-weight: 900; cursor: pointer; font-size: 18px;">
            ❤ ЛАЙК: <span id="main-like-count">0</span>
        </button>
    `;

    // Вставляем перед футером или в конец body
    const footer = document.querySelector('footer');
    if (footer) {
        footer.before(section);
    } else {
        document.body.appendChild(section);
    }

    // Связь с базой
    const likeRef = db.ref('likes/' + pageID);
    likeRef.on('value', (snap) => {
        const count = snap.val() || 0;
        const countSpan = document.getElementById('main-like-count');
        if (countSpan) countSpan.innerText = count;
    });

    document.getElementById('main-like-btn').onclick = function() {
        likeRef.transaction(c => (c || 0) + 1);
    };
    
    console.log("HealthLogic: Кнопка отрисована успешно!");
}

// Запуск
document.addEventListener("DOMContentLoaded", renderLikeSection);
