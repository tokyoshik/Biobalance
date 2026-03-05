// НАСТРОЙКИ ТОЛЬКО ЗДЕСЬ
const firebaseConfig = {
    apiKey: "AIzaSyBgjwzfctB0Z9Lyak4WXTo_wxb2vS5L-rs",
    authDomain: "healthlogic-fe5bd.firebaseapp.com",
    databaseURL: "https://healthlogic-fe5bd-default-rtdb.firebaseio.com",
    projectId: "healthlogic-fe5bd",
    storageBucket: "healthlogic-fe5bd.firebasestorage.app",
    messagingSenderId: "177114233773",
    appId: "1:177114233773:web:0e341fb52efcf7dc2cff24"
};

// Инициализация (защита от повтора)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
const auth = firebase.auth();

// Функция загрузки статей на главную (index.html)
function loadArticles() {
    const container = document.getElementById('articles-container');
    if (!container) return;

    db.ref('articles').on('value', snap => {
        container.innerHTML = '';
        const data = snap.val();
        if (data) {
            Object.entries(data).reverse().forEach(([id, post]) => {
                const card = document.createElement('article');
                card.className = 'article-card';
                card.onclick = () => { window.location.href = `article.html?id=${id}`; };

                let previewText = "Нажмите, чтобы прочитать...";
                if (post.blocks) {
                    const firstText = post.blocks.find(b => b.type === 'text' && b.content);
                    if (firstText) previewText = firstText.content.substring(0, 100) + "...";
                }

                card.innerHTML = `
                    <div class="card-img-wrapper">
                        <img src="${post.image || 'https://via.placeholder.com/600x300'}">
                    </div>
                    <div class="card-content">
                        <h2>${post.title}</h2>
                        <p>${previewText}</p>
                        <span>Читать →</span>
                    </div>
                `;
                container.appendChild(card);
            });
        }
    });
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', loadArticles);
