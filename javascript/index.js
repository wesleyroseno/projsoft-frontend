var baseurl = "https://ucdb-rest.herokuapp.com/api"

var loginModal = document.getElementById("loginModal");
var loginModalBtn = document.getElementById("loginModalButton");
var loginModalClose = document.getElementById("loginModalClose");
var logged = document.getElementById("logged");
var logoutButton = document.getElementById("logoutButton");

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
            `<div class="course-card"><p>${course.id} - ${course.name}</p></div>`;
    })
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


async function sendLogin(user) {
    try {
        let response = await fetch(baseurl + "/v1/auth/login", {
            method: 'POST',
            body: JSON.stringify(user),
            headers:{
                'Access-Control-Allow-Origin':'*',
                'Content-Type':'application/json;charset=utf-8'
            }
        });

        let json = await response.json();

        if (response.status == 200) {
            localStorage.setItem('token', json.token);

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
            alert(json.message);
        }
    }
    catch (e) {
        console.log(e);
    }
}

document.getElementById("loginButton").addEventListener("click", login, false);