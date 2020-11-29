//Pegando elementos do documento
const modalContainer = document.querySelector('.modal');
const containerNotas = document.querySelector('#container-notas');
const mensagem = document.querySelector('.mensagem');

//Criando array para poder exibir os meses em português. Os indices do array combinam com o numero do mês puxado
//pela função getMonth, deste modo caso o numero do mês seja 10 ele ira buscar o indice 10 referente a novembro,
//pois os itens do array iniciam do 0 e o getMonth conta os meses a partir do 0 por isso se encaixam corretamente.
//Ou é apenas um bug ou erro meu
const arrayMes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  
//Pegando a datas do usuario para substituir caso ele não insira um titulo
const data = new Date();
const dia = data.getUTCDate();
const mes = arrayMes[data.getUTCMonth()];
const ano = data.getFullYear();

//Expressão regular que captura elementos que não são caracteres
//como por exemplo: numeros e palavras
const spaces = /\w/;

//Função para exibir o modal para criação do conteúdo
function changeModal(event, container) {
  // previnindo que a página recarregue
  event.preventDefault();
  //abrindo modal caso esteja fechado, o contrário ocorre caso esteja aberto
  const containerSelect = container === undefined ? container = '.modal-edit' : container = container;
  document.querySelector(containerSelect).classList.toggle('open');

}

//Renderizando as notas para o usuário
function renderNotes() {
  //limpando o container para que as notas não acumulem
  containerNotas.innerHTML = '';
  
  //Verificando se o localStorage está vazio para poder exibir
  //uma mensagem para o usuário
  if (localStorage.getItem('notas') == null || localStorage.getItem('notas').length < 3) {
    mensagem.style.display = 'block';
  } else {
  //Array estando vazio, iremos percorre-lo para criar elementos
  //e guardar dentro destes elementos os valores que o usuário inseriu no modal  
    const arrayNotas = JSON.parse(localStorage.getItem('notas'));
    arrayNotas.forEach((nota, indice) => {

      const ul = document.createElement('ul');
      const span = document.createElement('span');
      const li = document.createElement('li');
      const buttonOption = document.createElement('a');
      const optionEdit = document.createElement('a');
      const optionDelete = document.createElement('a');

      span.innerText = nota.newTitle;
      buttonOption.classList.add('option');
      buttonOption.onclick = changeOption;

      optionEdit.innerText = 'Editar';
      optionEdit.className = 'options edit';
      optionEdit.onclick = renderValuesEdit;
      optionEdit.setAttribute('dataset', indice);

      optionDelete.innerText = 'Apagar';
      optionDelete.classList.add('options');
      optionDelete.setAttribute('dataset', indice);
      optionDelete.onclick = deleteNotes;

      li.innerText = nota.anotacaoValue;

      ul.classList.add('nota');
      ul.appendChild(optionEdit);
      ul.appendChild(buttonOption);
      ul.appendChild(optionDelete);
      ul.appendChild(span);
      ul.appendChild(li);

      containerNotas.insertBefore(ul, containerNotas.firstElementChild);
    })
  }
}

renderNotes();

//Criando as notas
function createNotes(event) {
  event.preventDefault();
  
  //Pegando campos title e anotação
  const tittle = modalContainer.querySelector('input[name="titulo"]');
  const anotacao = modalContainer.querySelector('textarea[name="anotacao"]');

  //Verificando através do método test se o valor que o usuário inseriu
  //bate com a Expressão regular criada
  if (anotacao.value == '' || !spaces.test(anotacao.value)) {
    alert('Insira um texto nas anotações')
  } else {

    //Pegando os valores inseridos
    const anotacaoValue = anotacao.value;
    const newTitle = tittle.value == '' ? tittle.value = `${dia} de ${mes} de ${ano}` : tittle.value = tittle.value;
    
    //Guardando os valores em um objeto para inserir no localStorage
    const values = {anotacaoValue, newTitle};

    //Transformando em formato JSON
    const jsonArray = JSON.stringify([values]);

    //Vericando se o localStorage está preenchido
    if (localStorage.getItem('notas') == null) {
      //Inserindo valores dentro do localStorage
      localStorage.setItem('notas', jsonArray);
    } else {
      //Caso array esteja preenchido, copiamos os valores e
      const getArray = localStorage.getItem('notas');
      //transformamos novamente em valores normais
      const convertArray = JSON.parse(getArray);

      //Inserindo os valores no final do array
      convertArray.push(values)
      //repetindo processo de conversão em JSON
      //e colocando-o no localStorage
      localStorage.setItem('notas', JSON.stringify(convertArray));
    }

    //Retirando a mensagem de vazio
    mensagem.style.display = 'none';
    //Limpando os inputs que usuário digitou
    tittle.value = '';
    anotacao.value = '';

    //fechando o modal e mostrando a nota que o usuário criou
    renderNotes();
    changeModal(event, '.modal',);
  }
}

//Abrindo opções de edição e exlusão
function changeOption(event) {
  //Exibindo caixa para o usuário ao clique no botão lateral
  event.target.nextElementSibling.classList.toggle('open');
  event.target.previousElementSibling.classList.toggle('open');
}

//Deletando notas
function deleteNotes(event) {
  //Selecionando o indice da nota, o indice é referente a sua posição no array
  const indice = event.target.getAttribute('dataset');
  //Puxando e convertendo os valores inseridos no localStorage
  const getArray = JSON.parse(localStorage.getItem('notas'));
  //Pegando o array convertido, indicando o indice que será excluido
  //e informando para a função quantos itens serão deletados a partir do indice passado
  //como o indice é 1 ele excluira ele mesmo
  getArray.splice(indice, 1);
  //Convertendo para o array JSON e inserindo no localStorage
  localStorage.setItem('notas', JSON.stringify(getArray));
  renderNotes();
}

//Renderizando valores que o usuário inseriu
function renderValuesEdit(event) {
  event.preventDefault();

  //Abrindo modal com os valores da anotação e inserindo os valores
  // de acordo com o indice passado no dataset da opção
  changeModal(event)

  const modalEdit = document.querySelector('.modal-edit');
  const indice = event.target.getAttribute('dataset');
  const getArray = JSON.parse(localStorage.getItem('notas'));
  document.querySelector('input[name="indice"]').value = indice;

  modalEdit.querySelector('input[name="titulo"]').value = getArray[indice].newTitle;
  modalEdit.querySelector('textarea').value =  getArray[indice].anotacaoValue;
}

//Editando a anotação inserindo os novos valores que o usuário inseriu
function editNotes(event) {
  event.preventDefault();
  //Pegando e convertendo o array dentro do localStorage
  const getArray = JSON.parse(localStorage.getItem('notas'));

  //Pegando os inputs com os valores
  const valueAnotacaoEdit = document.querySelector('.modal-edit textarea');
  const valueTitleEdit = document.querySelector('.modal-edit input[name="titulo"]');

  //Puxando o indice deixa em um input invisivel, pois não posso passar o indice da nota
  // a ser editada, dentro do parâmetro da função sem ela ser executada de imediato
  const indiceHidden = document.querySelector('.modal-edit input[name="indice"]').value;

  //Verificando se o usuário deixou o campo anotação em branco
  if (valueAnotacaoEdit.value == '' || !spaces.test(valueAnotacaoEdit.value)) {
    alert('Não deixe o campo em branco!')
  } else {

    //Caso o usuario deixar o campo em branco substituiremos por a data de edição
    const newTitleEdit = valueTitleEdit.value == '' || !spaces.test(valueTitleEdit.value) ? valueTitleEdit.value = `${dia} de ${mes} de ${ano}` : valueTitleEdit.value = valueTitleEdit.value;

    //Pegando a posição do array que será editada e adicionando os novos valores
    getArray[indiceHidden].anotacaoValue = valueAnotacaoEdit.value;
    getArray[indiceHidden].newTitle = newTitleEdit;

    //Limpando os campos
    valueTitleEdit.value = '';
    valueAnotacaoEdit.value = '';

    //Inserindo no localStorage
    localStorage.setItem('notas', JSON.stringify(getArray));
    //Renderizando as anotações, e fechando o modal
    renderNotes();
    changeModal(event, '.modal-edit');
  }
}