let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

//  MODAL (RECEITA)
async function abrirModalDireto(id) {
    try {
        const resposta = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
        const dados = await resposta.json();

        if (!dados.drinks) {
            alert("Receita não encontrada!");
            return;
        }

        const drink = dados.drinks[0];
        let ingredientes = "";


        // Percorre os 15 possíveis ingredientes da API
        for (let i = 1; i <= 15; i++) {
            let ing = drink[`strIngredient${i}`];
            let medida = drink[`strMeasure${i}`];
            if (ing) {
                ingredientes += `<li>${medida ? medida : ""} ${ing}</li>`;
            }
        }

        const conteudo = `
            <h2 style="color:#f39c12">${drink.strDrink}</h2>
            <img src="${drink.strDrinkThumb}" width="100%" style="max-width:250px; display:block; margin:auto">
            <p><b>Categoria:</b> ${drink.strCategory}</p>
            <p><b>Tipo:</b> ${drink.strAlcoholic}</p>
            <h3>Ingredientes:</h3>
            <ul>${ingredientes}</ul>
            <h3>Modo de Preparo:</h3>
            <p>${drink.strInstructions}</p>
        `;

        document.getElementById("conteudoModal").innerHTML = conteudo;
        document.getElementById("modal").style.display = "block";
    } catch (erro) {
        console.error("Erro ao buscar detalhes:", erro);
        alert("Erro ao carregar a receita.");
    }
}

function fecharModal() {
    document.getElementById("modal").style.display = "none";
}

// Fechar modal
window.onclick = function(event) {
    let modal = document.getElementById("modal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


async function buscarBebida() {
    let nome = document.getElementById("drink").value;
    if (!nome) return alert("Digite o nome de uma bebida!");

    const resposta = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${nome}`);
    const dados = await resposta.json();

    if (!dados.drinks) return alert("Nenhuma bebida encontrada.");
    
    let tabela = document.getElementById("tabela");
    let html = "";

    dados.drinks.forEach(drink => {
        html += `
            <tr>
                <td><img src="${drink.strDrinkThumb}" width="80"></td>
                <td><b>${drink.strDrink}</b></td>
                <td>${drink.strCategory}</td>
                <td>${drink.strAlcoholic}</td>
                <td>${drink.strIngredient1 || ""}...</td>
                <td>
                    <button class="btn-receita" onclick="abrirModalDireto('${drink.idDrink}')">Receita</button>
                    <button class="btn-salvar" onclick="salvarFavorito('${drink.idDrink}')">Salvar ⭐</button>
                    <button class="btn-excluir" onclick="this.parentElement.parentElement.remove()">Excluir</button>
                </td>
            </tr>`;
    });
    tabela.innerHTML = html;
}

// --- FAVORITOS ---
async function salvarFavorito(id) {
    // Evita duplicados
    if (favoritos.some(fav => fav.idDrink === id)) return alert("Já está nos favoritos!");

    const resposta = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
    const dados = await resposta.json();
    
    favoritos.push(dados.drinks[0]);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    mostrarFavoritos();
}

function mostrarFavoritos() {
    let tabela = document.getElementById("tabelaFavoritos");
    let html = "";

    favoritos.forEach((drink, i) => {
        html += `
            <tr>
                <td><img src="${drink.strDrinkThumb}" width="60"></td>
                <td>${drink.strDrink}</td>
                <td>
                    <button class="btn-receita" onclick="abrirModalDireto('${drink.idDrink}')">Receita</button>
                    <button class="btn-excluir" onclick="removerFavorito(${i})">Remover</button>
                </td>
            </tr>`;
    });
    tabela.innerHTML = html;
}

function removerFavorito(i) {
    favoritos.splice(i, 1);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    mostrarFavoritos();
}

// --- BUSCAR POR INGREDIENTE ---
async function buscarPorIngrediente() {
    let ing = document.getElementById("ingrediente").value;
    if (!ing) return alert("Digite um ingrediente!");

    const resposta = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ing}`);
    const dados = await resposta.json();

    let tabela = document.getElementById("tabelaIngredientes");
    let html = "";

    dados.drinks.forEach(drink => {
        html += `
            <tr>
                <td><img src="${drink.strDrinkThumb}" width="80"></td>
                <td>
                    ${drink.strDrink}<br>
                    <button class="btn-receita" onclick="abrirModalDireto('${drink.idDrink}')">Receita</button>
                    <button class="btn-salvar" onclick="salvarFavorito('${drink.idDrink}')">Salvar ⭐</button>
                </td>
            </tr>`;
    });
    tabela.innerHTML = html;
}

// --- FUNÇÕES DE LIMPAR ---
function limparTabela() { document.getElementById("tabela").innerHTML = ""; }
function limparTabelaIngredientes() { document.getElementById("tabelaIngredientes").innerHTML = ""; }

mostrarFavoritos();

// ENTER para buscar bebida
document.getElementById("drink").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        buscarBebida();
    }
});

// ENTER para buscar ingrediente
document.getElementById("ingrediente").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        buscarPorIngrediente();
    }
});
