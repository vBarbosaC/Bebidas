/**
 * Busca bebida na API
 * @returns {void}
 */
async function buscarBebida(){

let nome = document.getElementById("drink").value;

if(nome === ""){
alert("Digite uma bebida");
return;
}

let resposta = await fetch(
`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${nome}`
);

let dados = await resposta.json();

if(!dados.drinks){
alert("Bebida não encontrada");
return;
}

let drink = dados.drinks[0];

mostrarTabela(drink);

salvarLocal(drink);

}

/**
 * Mostra bebida na tabela
 */
function mostrarTabela(drink){

let tabela = document.getElementById("tabela");

let linha = `
<tr>
<td>${drink.strDrink}</td>
<td>${drink.strCategory}</td>
<td>${drink.strAlcoholic}</td>
<td>${drink.strIngredient1}</td>
<td><button onclick="remover(this)">Excluir</button></td>
</tr>
`;

tabela.innerHTML += linha;

}

/**
 * Remove linha da tabela
 * @param {HTMLElement} botao
 */
function remover(botao){
botao.parentElement.parentElement.remove();
}

/**
 * Salva bebida no localStorage
 * @param {object} drink
 */
function salvarLocal(drink){

let lista = JSON.parse(localStorage.getItem("bebidas")) || [];

lista.push(drink);

localStorage.setItem("bebidas", JSON.stringify(lista));

}