// 1. ТВОЙ КОНФИГ (Данные из Firebase)

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

// 2. ЗАПУСК (Сделано ровно под твой training.html)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig); 
}
const db = firebase.database();

// 3. СОЗДАНИЕ КНОПКИ (Появится сама)
function initLikes() {
    // Находим страницу
    const pageID = window.location.pathname.split("/").pop().replace(".html", "") || "index";
    
    // Код самой кнопки
    const html = `
    <div id="like-container" style="padding: 50px 10%; text-align: center; border-top: 2px solid #000; background: #fff;">
        <button id="like-btn" style="background: #000; color: #fff; border: none; padding: 15px 35px; font-weight: 900; cursor: pointer; font-size: 18px;">
            ❤ ЛАЙК <span id="like-count">0</span>
        </button>
    </div>`;

    // Вставляем перед подвалом (footer)
    const footer = document.querySelector('footer');
    if (footer) {
        footer.insertAdjacentHTML('beforebegin', html);
    } else {
        document.body.insertAdjacentHTML('beforeend', html);
    }

    // Связь с базой
    const likeRef = db.ref('likes/' + pageID);
    
    // Получаем количество лайков
    likeRef.on('value', (snap) => {
        const count = snap.val() || 0;
        const countSpan = document.getElementById('like-count');
        if (countSpan) countSpan.innerText = count;
    });

    // Нажатие на кнопку
    document.getElementById('like-btn').onclick = function() {
        likeRef.transaction(current => (current || 0) + 1);
    };
}

// Запускаем, когда страница загрузится
document.addEventListener("DOMContentLoaded", initLikes);
