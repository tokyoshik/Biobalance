// 1. КОНФИГ (Твои данные из Firebase Console)
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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
// 2. ИНИЦИАЛИЗАЦИЯ (Строго через firebase. объект)
// Это исправляет твою ошибку ReferenceError
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// 3. ФУНКЦИЯ ОТРИСОВКИ КНОПКИ
function drawLikes() {
    console.log("HealthLogic: Начинаю отрисовку...");

    // ID страницы для базы (чтобы лайки были разные у тренировок и магния)
    const pageID = window.location.pathname.split("/").pop().replace(".html", "") || "index";
    
    // Создаем HTML-структуру
    const likeSection = document.createElement('section');
    likeSection.id = "firebase-interactions";
    likeSection.style.cssText = "padding: 50px 10%; background: #fff; border-top: 2px solid #000; text-align: center;";
    
    likeSection.innerHTML = `
        <button id="like-btn" style="background: #000; color: #fff; border: none; padding: 15px 40px; font-weight: 900; cursor: pointer; font-size: 18px; text-transform: uppercase;">
            ❤ ЛАЙК: <span id="like-count">0</span>
        </button>
    `;

    // Вставляем перед футером (или в конец body, если футера нет)
    const footer = document.querySelector('footer');
    if (footer) {
        footer.before(likeSection);
    } else {
        document.body.appendChild(likeSection);
    }

    // ЛОГИКА БАЗЫ ДАННЫХ
    const likeRef = db.ref('likes/' + pageID);

    // Слушаем изменения (Realtime)
    likeRef.on('value', (snapshot) => {
        const count = snapshot.val() || 0;
        const countSpan = document.getElementById('like-count');
        if (countSpan) countSpan.innerText = count;
    });

    // Обработка клика (Транзакция, чтобы не сбивался счет при одновременных кликах)
    document.getElementById('like-btn').onclick = function() {
        likeRef.transaction((currentCount) => {
            return (currentCount || 0) + 1;
        });
    };
    
    console.log("HealthLogic: Кнопка добавлена успешно!");
}

// ЗАПУСК (Ждем готовности документа)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', drawLikes);
} else {
    drawLikes();
}
