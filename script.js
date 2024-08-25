//seleciona os elementos do formulario
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

//selciona os elementos da lista
const expenseList = document.querySelector("ul");
const expenseQuantity = document.querySelector("aside header p span");
const expenseTotal = document.querySelector("aside header h2")

//captura o evento de input para o valor
amount.oninput = () => {
  //usando o regex para remover as letras
  let value = amount.value.replace(/\D/g, "");

  //Trasformar o valor em centavos
  value = Number(value) / 100;

  //atualiza o valor do input
  amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
  //formata no padrao no BRL
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return value;
}

//Captura o evento de dubmit do formulario para obter os valores
form.onsubmit = () => {
  // Previne o comportamento padrão de recarregar a pagina
  event.preventDefault();

  //Cria um objeto cpm detalhes na nova despesa
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };
  //Chama a função  que ira adicionar o item na lista
  expenseAdd(newExpense);
};
//adiciona um novo item na lista
function expenseAdd(newExpense) {
  try {
    // Cria o elemento para a adicionar o item (li) na lista (ul)
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    // Cria o ícone da categoria
    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    // Cria a info da despesa
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    // Cria o nome da despesa
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    // Cria a categoria da despesa
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    // Adiciona o nome e a categoria na div das informações da despesa
    expenseInfo.append(expenseName, expenseCategory);

    // Criando o valor da despesa
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`;

    //cria icone de remover
    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "remover");

    // Adiciona as informações no item
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

    // Adiciona o item na lista
    expenseList.append(expenseItem);

    //atualiza os totais
    updateTotals();
    //limpa o formulario
    inputClear()
  } catch (error) {
    alert("Não foi possivel atualizar", error);
    console.log(error);
  }
}

//atualizar os totais
function updateTotals() {
  try {
    //recupera todos os itens da lista
    const items = expenseList.children;
    //atualiza
    expenseQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    } `;

    //variavel para incrementar o total
    let total = 0;

    //percorre cada item da lista
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount");

      //remover caracteres não numericas e substitui a virgula pelo ponto
      let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")
        //converte o valor para float
        value = parseFloat(value)
        
       //verifica s é um numero valido
       if(isNaN(value)){
        return alert("não e um numero.")
       } 

       //incremetar um valor
       total += Number(value)
       
    }

    //cria a span para diconar o R$ formatado
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$" 

    //formata o valor e remover R$ que será exibido pelo small  com um estilo customizado
    total = formatCurrencyBRL(total).toUpperCase().replace("R$","")
    //limpa o valor
    expenseTotal.innerHTML = ""

    expenseTotal.append(symbolBRL, total)
  } catch (error) {
    console.log(error);
    alert("erro");
  }
}


//evento que captura o clique nos itens da lista
expenseList.addEventListener("click",function(event){
  //verifica se o elemento clicado é o icone de remover.
  if(event.target.classList.contains("remove-icon")){
    //obter a li pai do item clicado
    const item = event.target.closest(".expense")
    item.remove()
    
  }
  updateTotals()
})


function inputClear(){
  //limpa os inputs
  expense.value = ""
  category.value = ""
  amount.value = ""

  //coloca foco no input
  expense.focus()
}