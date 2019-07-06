var baseurl = "https://ucdb-rest.herokuapp.com/api"

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
        if ( element.email === localStorage.getItem("userEmail")) {
            return true;
        }
    }
}

function mountProfile(courseProfile) {
    var likesCount = courseProfile.likes.length;
    var likeMsg = "Dar like";
    if (userLikes(courseProfile)) {
        likeMsg = "Retirar like";
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
    <input type="text" placeholder="Comente algo sobre a disciplina" name="comments" id="comments">`;
}

function createCourseModal(courseProfile) {
    mountProfile(courseProfile);

    var likeButton = document.getElementById("likeButton");
    likeButton.addEventListener('click', _ => sendLike(courseProfile), false);
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
