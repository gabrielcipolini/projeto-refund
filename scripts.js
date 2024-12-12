// Seleciona os elementos do formulário.
const form = document.querySelector("form")
const expense = document.getElementById("expense")
const category = document.getElementById("category")
const amount = document.getElementById("amount")

// Seleciona os elementos da lista.
const expenseList = document.querySelector("ul")
const expenseQuantity = document.querySelector("aside header p span")
const expenseTotal = document.querySelector("aside header h2")

// Captura o evento de input para formatar o valor.
amount.oninput = () => {
  // Obtém valor atual do input e remove os caracteres não-numéricos.
  let value = amount.value.replace(/\D/g, "")

  // Transforma o valor em centavos.
  value = Number(value / 100)

  // Atualiza o valor do input.
  amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
  // Formata o valor no padrão BRL (Real Brasileiro).
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  // Retorna o valor formatado.
  return value
}

// Captura o evento de submit do formulário.
form.onsubmit = (event) => {
  // Previne o comportamento padrão do form.
  event.preventDefault()

  // Cria um objeto com os detalhes da nova despesa.
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  }

  console.log(newExpense)

  // Chama a função que irá adicionar o item na lista.
  expenseAdd(newExpense)
}

// Adiciona um novo item na lista.
function expenseAdd(newExpense) {
  try {
    // Cria o elemento li dentro da ul
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    // Cria o elemento img dentro de li
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute(
      "src",
      `assets/icons/${newExpense.category_id}.svg`
    )
    expenseIcon.setAttribute("alt", newExpense.category_name)

    // Cria a info da despesa.
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    // Cria o nome da despesa.
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    // Cria a categoria da despesa.
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    // Cria o valor inserido.
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`

    // Cria o botão de remover.
    const buttonRemove = document.createElement("button")
    buttonRemove.classList.add("button-remove")
    buttonRemove.setAttribute("type", "button")
    buttonRemove.setAttribute("aria-label", "Remover item")

    // Adiciona o nome e a categoria na expenseInfo.
    expenseInfo.append(expenseName, expenseCategory)

    // Adiciona as informações no item.
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, buttonRemove)

    // Adiciona o item na lista.
    expenseList.append(expenseItem)

    // Limpa o formulário para adicionar um novo item.
    formClear()

    // Atualiza os totais.
    updateTotals()
  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas.")
    console.log(error)
  }
}

// Atualiza os totais.
function updateTotals() {
  try {
    // Recupera todos os itens da lista.
    const items = expenseList.children

    // Atualiza a quantidade de despesas.
    expenseQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`

    // Variável para incrementar o total.
    let total = 0

    // Percorrer os itens da lista.
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount")
      // Remove caracteres não numéricos e substitui a vírgula pelo ponto.
      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".")

      // Converte o valor para float.
      value = parseFloat(value)

      // Verificar se é um número válido.
      if (isNaN(value)) {
        return alert(
          "Não foi possível calcular o total. O valor não parece ser um número."
        )
      }

      // Incrementar o valor total.
      total += Number(value)
    }

    // Cria a small para adicionar o R$ formatado.
    const symbolBRL = document.createElement("small")
    symbolBRL.textContent = "R$"

    // Formata o valor e remove o R$ que será exibido pela small com um estilo customizado.
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

    // Limpa o conteúdo do elemento.
    expenseTotal.innerHTML = ""

    // Adiciona o símbolo da moeda e o valor somado.
    expenseTotal.append(symbolBRL, total)
  } catch (error) {
    alert("Não foi possível calcular os totais.")
    console.log(error)
  }
}

// Captura o evento de clique.
expenseList.addEventListener("click", function (event) {
  // Verifica se o elemento clicado
  if (event.target.classList.contains("button-remove")) {
    // Obtém a li pai do elemento clicado.
    const item = event.target.closest(".expense")

    // Remove o item.
    item.remove()
  }

  // Atualiza os totais.
  updateTotals()
})

function formClear() {
  expense.value = ""
  category.value = ""
  amount.value = ""

  expense.focus()
}
