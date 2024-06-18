var modal = document.getElementById("infoModal");
var btn = document.querySelector(".info-floating"); // Кнопка для открытия модального окна
var span = document.getElementsByClassName("close")[0]; // Кнопка закрытия модального окна

btn.onclick = function() {
    modal.style.display = "block"; // Показать модальное окно
}

span.onclick = function() {
    modal.style.display = "none"; // Скрыть модальное окно
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none"; // Скрыть модальное окно при клике вне его
    }
}
