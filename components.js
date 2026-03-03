console.log("HealthLogic: components.js загружен!");

// 1. КОНФИГ

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

// 2. ИНИЦИАЛИЗАЦИЯ (через проверку, чтобы не было ошибок)
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// 3. ФУНКЦИЯ ОТРИСОВКИ (Работает на любой странице)
function initGlobalFeatures() {
    console.log("HealthLogic: Инициализация функций...");
    
    const pageID = window.location.pathname.split("/").pop().replace(".html", "") || "index";
    const db = firebase.database();

    // Создаем контейнер
    const interactionDiv = document.createElement('div');
    interactionDiv.style.cssText = "padding: 50px 10%; text-align: center; background: #fff; border-top: 2px solid #000;";
    interactionDiv.innerHTML = `
        <button id="global-like-btn" style="background: #000; color: #fff; border: none; padding: 15px 30px; font-weight: 900; cursor: pointer;">
            ❤ ЛАЙК <span id="global-like-count">0</span>
        </button>
    `;

    // Вставляем перед футером
    const footer = document.querySelector('footer');
    if (footer) {
        footer.before(interactionDiv);
    } else {
        document.body.appendChild(interactionDiv);
    }

    // Связь с базой
    const likeRef = db.ref('likes/' + pageID);
    likeRef.on('value', (snap) => {
        const count = snap.val() || 0;
        const span = document.getElementById('global-like-count');
        if (span) span.innerText = count;
    });

    document.getElementById('global-like-btn').onclick = () => {
        likeRef.transaction(c => (c || 0) + 1);
    };
}

// Запуск
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalFeatures);
} else {
    initGlobalFeatures();
}
