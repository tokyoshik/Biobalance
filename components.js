// Ждем загрузки страницы
window.addEventListener('load', function() {

    // 1. Твой исправленный конфиг
    const firebaseConfig = {
        apiKey: "AIzaSyBgjwzfctB0Z9Lyak4WXTo_wxb2vS5L-rs",
        authDomain: "healthlogic-fe5bd.firebaseapp.com",
        // ИСПРАВЛЕНО: Теперь адрес ведет напрямую в базу
        databaseURL: "https://healthlogic-fe5bd-default-rtdb.firebaseio.com",
        projectId: "healthlogic-fe5bd",
        storageBucket: "healthlogic-fe5bd.firebasestorage.app",
        messagingSenderId: "177114233773",
        appId: "1:177114233773:web:0e341fb52efcf7dc2cff24"
    };

    // 2. Инициализация (ИСПРАВЛЕНО: используем firebase.initializeApp)
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.database();

    // 3. Создаем кнопку лайка
    const pageID = window.location.pathname.split("/").pop().replace(".html", "") || "index";
    
    const likeBtn = document.createElement('button');
    likeBtn.id = "l-btn";
    likeBtn.innerHTML = `❤ ЛАЙКОВ: <span id="l-count">0</span>`;
    
    // Стили, чтобы кнопка всегда была видна (в углу)
    likeBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        background: #ff4757;
        color: white;
        border: none;
        padding: 15px 25px;
        border-radius: 50px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        font-weight: bold;
    `;
    document.body.appendChild(likeBtn);

    // 4. Логика работы с базой
    const ref = db.ref('likes/' + pageID);

    // Получаем данные
    ref.on('value', (snapshot) => {
        const count = snapshot.val() || 0;
        document.getElementById('l-count').innerText = count;
    });

    // Клик по кнопке
    likeBtn.onclick = function() {
        ref.transaction((current) => {
            return (current || 0) + 1;
        });
    };

    console.log("HealthLogic Firebase подключен! Страница:", pageID);
});
