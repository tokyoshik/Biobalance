// 1. Твой конфиг (Впиши свои ключи!)

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
// 2. Инициализация инструментов
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
const auth = firebase.auth();

// 3. Функция отрисовки интерфейса (Лайки и Комменты)
function renderInteractions() {
    // Определяем ID страницы по названию файла (например, 'training')
    const pageID = window.location.pathname.split("/").pop().replace(".html", "") || "index";
    
    const containerHTML = `
    <section id="feedback-section" style="padding: 60px 10%; background: #fff; border-top: 3px solid #121212; font-family: 'Inter', sans-serif;">
        <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 30px;">
            <button id="like-btn" style="background: #121212; color: #fff; border: none; padding: 15px 30px; cursor: pointer; font-weight: 900; font-size: 16px; border-radius: 4px;">
                ❤ ПОЛЕЗНО <span id="like-count" style="margin-left: 10px; opacity: 0.8;">0</span>
            </button>
        </div>

        <h3 style="text-transform: uppercase; font-weight: 900; letter-spacing: -1px;">Обсуждение_</h3>
        <div id="comm-list" style="margin: 20px 0; max-height: 400px; overflow-y: auto; border-left: 2px solid #eee; padding-left: 20px;">
            </div>

        <div style="margin-top: 30px;">
            <textarea id="comm-text" style="width: 100%; height: 100px; padding: 15px; border: 2px solid #121212; font-family: inherit; resize: none;" placeholder="Напишите ваше мнение..."></textarea>
            <button onclick="sendComment('${pageID}')" style="margin-top: 10px; background: #121212; color: #fff; border: none; padding: 12px 25px; cursor: pointer; font-weight: 700;">ОТПРАВИТЬ</button>
        </div>
    </section>`;

    // Вставляем перед футером
    const footer = document.querySelector('footer');
    if (footer) {
        footer.insertAdjacentHTML('beforebegin', containerHTML);
    }

    // --- ЛОГИКА ЛАЙКОВ ---
    const likeRef = db.ref('likes/' + pageID);
    likeRef.on('value', (snapshot) => {
        const count = snapshot.val() || 0;
        const span = document.getElementById('like-count');
        if (span) span.innerText = count;
    });

    document.getElementById('like-btn').onclick = () => {
        likeRef.transaction((current) => (current || 0) + 1);
    };

    // --- ЛОГИКА КОММЕНТАРИЕВ ---
    const commRef = db.ref('comments/' + pageID);
    commRef.on('value', (snapshot) => {
        const list = document.getElementById('comm-list');
        if (!list) return;
        list.innerHTML = "";
        snapshot.forEach((child) => {
            const data = child.val();
            list.innerHTML += `
                <div style="margin-bottom: 20px; background: #f9f9f9; padding: 15px; border-radius: 5px;">
                    <div style="font-weight: 900; font-size: 12px; margin-bottom: 5px; color: #555;">${data.user}</div>
                    <div style="font-size: 15px; line-height: 1.4;">${data.text}</div>
                </div>`;
        });
    });
}

// Функция отправки комментария
window.sendComment = (id) => {
    const textarea = document.getElementById('comm-text');
    const text = textarea.value.trim();
    if (!text) return;

    const userEmail = auth.currentUser ? auth.currentUser.email : "Анонимный пользователь";
    
    db.ref('comments/' + id).push({
        user: userEmail,
        text: text,
        timestamp: Date.now()
    });

    textarea.value = "";
};

// Запуск при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
    // Запускаем только на страницах статей
    if (window.location.pathname.includes("training") || 
        window.location.pathname.includes("magnesium") || 
        window.location.pathname.includes("fiber")) {
        renderInteractions();
    }
});
