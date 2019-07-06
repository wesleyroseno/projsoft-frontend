var loginModal = document.getElementById("loginModal");
var loginModalBtn = document.getElementById("loginModalButton");
var loginModalClose = document.getElementById("loginModalClose");

loginModalBtn.onclick = function () {
    loginModal.style.display = "block";
}

loginModalClose.onclick = function () {
    loginModal.style.display = "none";
}

var createUserModal = document.getElementById("createUserModal");
var createUserModalBtn = document.getElementById("createUserModalButton");
var createUserModalClose = document.getElementById("createUserModalClose");

createUserModalBtn.onclick = function () {
    createUserModal.style.display = "block";
}

createUserModalClose.onclick = function () {
    createUserModal.style.display = "none";
}

var aboutButton = document.getElementById("aboutButton");
var coursesButton = document.getElementById("coursesButton");
var rankingButton = document.getElementById("rankingButton");

var aboutPage = document.getElementById("about");
var coursesPage = document.getElementById("courses");
var rankingPage = document.getElementById("ranking");

aboutButton.onclick = function () {
    aboutPage.style.display = "block";
    coursesPage.style.display = "none";
    rankingPage.style.display = "none";
}

coursesButton.onclick = function () {
    aboutPage.style.display = "none";
    coursesPage.style.display = "block";
    rankingPage.style.display = "none";
}

rankingButton.onclick = function () {
    aboutPage.style.display = "none";
    coursesPage.style.display = "none";
    rankingPage.style.display = "block";
}

window.onclick = function (event) {
    if (event.target == loginModal) {
        loginModal.style.display = "none";
    }
    if (event.target == createUserModal) {
        createUserModal.style.display = "none";
    }
} 