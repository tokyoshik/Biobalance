// 1. Твой конфиг (проверь только ссылку databaseURL)

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

// 2. Инициализация (С ИСПРАВЛЕНИЕМ ОШИБКИ ИЗ КОНСОЛИ)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig); // Добавили firebase.
}
const db = firebase.database();

// 3. Функция, которая создаст кнопку
function createLikeButton() {
    const pageID = window.location.pathname.split("/").pop().replace(".html", "") || "index";
    
    const html = `
    <div id="like-section" style="padding: 40px; text-align: center; border-top: 2px solid #000;">
        <button id="like-btn" style="background: #000; color: #fff; padding: 15px 30px; cursor: pointer; font-weight: 900;">
            ❤ ЛАЙК <span id="like-count">0</span>
        </button>
    </div>`;

    // Вставляем перед футером
    const footer = document.querySelector('footer');
    if (footer) {
        footer.insertAdjacentHTML('beforebegin', html);
    } else {
        document.body.insertAdjacentHTML('beforeend', html);
    }

    // Связь с твоей Realtime Database (твои правила из фото 2 это позволят)
    const likeRef = db.ref('likes/' + pageID);
    
    likeRef.on('value', (snapshot) => {
        const count = snapshot.val() || 0;
        const span = document.getElementById('like-count');
        if (span) span.innerText = count;
    });

    document.getElementById('like-btn').onclick = () => {
        likeRef.transaction(current => (current || 0) + 1);
    };
}

// Запуск после загрузки страницы
document.addEventListener("DOMContentLoaded", createLikeButton);
