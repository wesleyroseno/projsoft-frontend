let urlbase = 'https://ucdb-rest.herokuapp.com/api/v1/courses/';

async function get_disciplinas() {
    await fetch(urlbase)
    .then(response => response.json())
    .then(data => preenche_tabela(data));
}

function preenche_tabela(disciplinas){
    let $disciplinas = document.getElementById("disciplinas");
    $disciplinas.innerHTML =
    `<table id="table">
    <div class="header-row row">
        <span class="cell primary">ID</span>
        <span class="cell cell-name">Nome</span> 
    </div>`;
	disciplinas.forEach(disc => {
		$disciplinas.innerHTML += 
        `<div class="row">
            <span class="cell" data-label="ID">${disc.id}</span>
            <span class="cell cell-name" data-label="NOME"><a href="perfil.html?discID=${disc.id}">${disc.name}</a></span>
        </div>`;
    });
    $disciplinas.innerHTML += `</table>`;
}

get_disciplinas();