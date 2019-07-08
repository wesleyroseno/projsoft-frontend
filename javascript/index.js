var baseurl = "https://ucdb-rest.herokuapp.com/api"
//var baseurl = "http://localhost:8080/api"

var loginModal = document.getElementById("loginModal");
var loginModalBtn = document.getElementById("loginModalButton");
var loginModalClose = document.getElementById("loginModalClose");
var logged = document.getElementById("logged");
var logoutButton = document.getElementById("logoutButton");
var containerCourseModal = document.getElementById("containerCourseModal");


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

var courseModal = document.getElementById("courseModal");
var courseModalClose = document.getElementById("courseModalClose");

courseModalClose.onclick = function () {
    courseModal.style.display = "none";
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
    fetchCourses()
}

rankingButton.onclick = function () {
    if (!localStorage.getItem("token")) {
        alert("Faça login para poder acessar o Ranking.");
        return;
    }
    aboutPage.style.display = "none";
    coursesPage.style.display = "none";
    rankingPage.style.display = "block";
    updateRanking();
}

async function updateRanking() {
    var rankingContainer = document.getElementById("ranking-container");

    await fetch(baseurl + "/v1/courses/private/all", {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
    })
            .then(response => response.json())
            .then(data => loadRanking(data));
}

function loadRanking(courses) {
    courses.sort((a, b) => a.likes.length < b.likes.length ? 1 : -1);

    var rankingContainer = document.getElementById("ranking-container");
    rankingContainer.innerHTML = ``;
    rankingContainer.innerHTML += `<div class="ranking-row"><strong>POSIÇÃO</strong></div><div class="ranking-row"><strong>NÚMERO DE LIKES</strong></div><div class="ranking-row"><strong>ID - NOME DA DISCIPLINA</strong></div>`;
    for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        console.log(course);
        rankingContainer.innerHTML += `<div class="ranking-row">${i+1}</div><div class="ranking-row">${course.likes.length}</div><div class="ranking-row">${course.id + " - " + course.name}</div>`;
    }
}

window.onclick = function (event) {
    if (event.target == loginModal) {
        loginModal.style.display = "none";
    }
    if (event.target == createUserModal) {
        createUserModal.style.display = "none";
    }
    if (event.target == courseModal) {
        courseModal.style.display = "none";
    }
}

var coursesLayout = document.getElementById("coursesLayout")


async function fetchCourses(query) {
    if (query) {
        await fetch(baseurl + "/v1/courses/?query=" + query)
            .then(response => response.json())
            .then(data => loadCourses(data));
    } else {
        await fetch(baseurl + "/v1/courses/")
            .then(response => response.json())
            .then(data => loadCourses(data));
    }
}
function loadCourses(courses) {
    coursesLayout.innerHTML = '';
    courses.forEach(course => {
        coursesLayout.innerHTML +=
            `<div class="course-card" id="course-card-${course.id}"><p>${course.id} - ${course.name}</p></div>`;
    });
    var courseCards = document.getElementsByClassName("course-card");

    for (let index = 0; index < courseCards.length; index++) {
        var element = courseCards[index];
        element.addEventListener('click', openCourseModal, false);
    }
}

//setup before functions
var typingTimer;                //timer identifier
var doneTypingInterval = 800;  //time in ms, 1 second for example
var search = document.getElementById("search");

//on keyup, start the countdown
search.onkeyup = function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
};

//on keydown, clear the countdown 
search.onkeydown = function () {
    clearTimeout(typingTimer);
};

//user is "finished typing," do something
function doneTyping() {
    fetchCourses(search.value);

}

function login() {
    sendLogin({
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value
    });
}

logoutButton.onclick = function () {
    loginModalBtn.style.display = "block";
    createUserModalBtn.style.display = "block";

    logoutButton.style.display = "none";
    logged.style.display = "none";
    logged.innerHTML = ``;
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');

    rankingPage.style.display = "none";
}

async function sendLogin(user) {
    try {
        let response = await fetch(baseurl + "/v1/auth/login", {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json;charset=utf-8'
            }
        });

        let json = await response.json();

        if (response.status == 200) {
            localStorage.setItem('token', json.token);
            localStorage.setItem('userEmail', user.email);

            loginModal.style.display = "none";
            document.getElementById("loginEmail").value = "";
            document.getElementById("loginPassword").value = "";

            loginModalBtn.style.display = "none";
            createUserModalBtn.style.display = "none";

            logoutButton.style.display = "block";
            logged.style.display = "block";
            logged.innerHTML = `${user.email}                 `;
        }
        else {
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            alert(json.message);
        }
    }
    catch (e) {
        console.log(e);
    }
}

document.getElementById("loginButton").addEventListener("click", login, false);

function sendCreateUserRequest() {
    createUser({
        email: document.getElementById("email").value,
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        password: document.getElementById("password").value
    });
}

async function createUser(user) {
    try {
        let response = await fetch(baseurl + "/v1/users/", {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json;charset=utf-8'
            }
        });

        let json = await response.json();

        if (response.status == 201) {

            loginModal.style.display = "block";
            createUserModal.style.display = "none";
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
            document.getElementById("firstName").value = "";
            document.getElementById("lastName").value = "";
        }
        else {
            alert(json.message);
        }
    }
    catch (e) {
        console.log(e);
    }
}

document.getElementById("createUserButton").addEventListener("click", sendCreateUserRequest, false);

async function openCourseModal() {
    if (!localStorage.getItem("token")) {
        alert("Faça login para poder acessar o perfil de uma disciplina.");
        return;
    }

    var courseId = this.id.split("-")[2];

    try {
        var response2 = await fetch(baseurl + "/v1/courses/private/" + courseId, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        });

        var json2 = await response2.json();

        if (response2.status == 200) {
            courseModal.style.display = "block";
            createCourseModal(json2);
        }
        else {
            alert(json2.message);
        }
    }
    catch (e) {
        console.log(e);
    }
}

function userLikes(courseProfile) {
    for (let i = 0; i < courseProfile.likes.length; i++) {
        const element = courseProfile.likes[i];
        if (element.email === localStorage.getItem("userEmail")) {
            return true;
        }
    }
}

function contains(comments, comment) {
    for (let i = 0; i < comments.length; i++) {
        if (comments[i].id === comment.id) {
            return true;
        }
    }
    return false;
}

function mountProfile(courseProfile) {

    courseProfile.comments.sort((a, b) => (new Date(a.created) > new Date(b.created)) ? 1 : -1);

    var likesCount = courseProfile.likes.length;
    var likeMsg = "Dar like";
    if (userLikes(courseProfile)) {
        likeMsg = "Retirar like";
    }

    var commentsFiltered = [];
    for (let i = courseProfile.comments.length - 1; i > 0; i--) {
        const c = courseProfile.comments[i];
        if (!contains(commentsFiltered, c)) {
            commentsFiltered.push(c);
        }
    }

    var likesStr = "";
    var separator = "";
    for (let i = 0; i < courseProfile.likes.length; i++) {
        const element = courseProfile.likes[i];
        likesStr += separator + element.firstName + " " + element.lastName + " (" + element.email + ")";
        separator = ", ";
    }
    likesStr += ".";
    containerCourseModal.innerHTML = `<h1>${courseProfile.id} - ${courseProfile.name}</h1>
    <hr>
    <p>${likesCount} likes</p>
    <div id="likes-container">${likesStr}</div>
    <button id="likeButton">${likeMsg}</button>
    <hr>
    <label for="comments"><b>Comentários</b></label>
    <form action="javascript:void(0);">
    <div class="commentContainer">
    <input type="text" placeholder="Comente algo sobre a disciplina" name="comments" id="comments" required>
    <button id="commentButton">Comentar</button>
    </div>
    </form>`;
    for (let i = 0; i < commentsFiltered.length; i++) {
        const element = commentsFiltered[i];
        containerCourseModal.innerHTML += `<div class="commentContainer cardComment">
                                                <div><p><strong>${element.from.email === localStorage.getItem("userEmail") ? "<em>" + element.from.firstName + " " + element.from.lastName + " (" + element.from.email + ")</em>" :
                element.from.firstName + " " + element.from.lastName + "(" + element.from.email + ")"
            }</strong> - ${new Date(element.created).toLocaleString()}</p><p class="cardMessage">${element.deleted? '<div class="deletedMessage">Mensagem apagada!</div>': element.content}</p></div>
                                                <div>${element.from.email === localStorage.getItem("userEmail") && !element.deleted? '<button class="deleteButton" id="deleteButton-' + element.id + '">Deletar</button>' : ""}</div>
                                                </div>`;
    }
}

function createCourseModal(courseProfile) {
    mountProfile(courseProfile);

    var likeButton = document.getElementById("likeButton");
    likeButton.addEventListener('click', _ => sendLike(courseProfile), false);
    var commentButton = document.getElementById("commentButton");
    commentButton.addEventListener('click', _ => sendComment(courseProfile), false);

    var deleteButtons = document.getElementsByClassName("deleteButton");

    for (let index = 0; index < deleteButtons.length; index++) {
        var element = deleteButtons[index];
        element.addEventListener('click', _ => {
            sendDeleteComment(courseProfile.id, element.id)
            }, false);
    }
}

async function sendDeleteComment(courseId, id) {
    try {
        var commentId = id.split("-")[1];

        console.log(commentId);
        var response2 = await fetch(baseurl + "/v1/courses/private/" + courseId + "/comment/" + commentId, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        });

        var json2 = await response2.json();

        if (response2.status == 200) {
            createCourseModal(json2);
        }
        else {
            alert(json2.message);
        }
    }
    catch (e) {
        console.log(e);
    }
}

async function sendComment(courseProfile) {
    try {
        var comments = document.getElementById("comments");
        var response2 = await fetch(baseurl + "/v1/courses/private/" + courseProfile.id + "/comment", {
            method: 'POST',
            body: comments.value,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        });

        var json2 = await response2.json();

        if (response2.status == 200) {
            createCourseModal(json2);
        }
        else {
            alert(json2.message);
        }
    }
    catch (e) {
        console.log(e);
    }
}

async function sendLike(courseProfile) {
    try {
        var response2 = await fetch(baseurl + "/v1/courses/private/" + courseProfile.id + "/like", {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        });

        var json2 = await response2.json();

        if (response2.status == 200) {
            createCourseModal(json2);
        }
        else {
            alert(json2.message);
        }
    }
    catch (e) {
        console.log(e);
    }
}

function checkLoggedUser() {
    if (localStorage.getItem("userEmail")) {
        loginModalBtn.style.display = "none";
        createUserModalBtn.style.display = "none";

        logoutButton.style.display = "block";
        logged.style.display = "block";
        logged.innerHTML = localStorage.getItem("userEmail");
    } else {
        loginModalBtn.style.display = "block";
        createUserModalBtn.style.display = "block";

        logoutButton.style.display = "none";
        logged.style.display = "none";
    }
}

checkLoggedUser();