'use strict';

var pessoas = [];
var produtosGrupo = [];

var todos = {id: 0, nome: 'Todos', produtos: produtosGrupo, pessoas: pessoas};

var grupos = [todos];

var produtos = [];

function element(id){
	return document.getElementById(id);
}

var dialogPessoa = element("dialog-pessoa");
var dialogPessoaText = element("dialog-pessoa-text");

var dialogComida = element("dialog-comida");
var dialogComidaText = element("dialog-comida-text");

var dialogGrupo = element("dialog-grupo");
var dialogGrupoText = element("dialog-grupo-text");
var dialogGrupoSelect = element("dialog-grupo-select");

var pessoaNomeInput = element('dialog-pessoa-nome');

var comidaNomeInput = element('dialog-comida-nome');
var comidaPrecoInput = element('dialog-comida-preco');

var results = element("results");
var total = element("total");

var content = element("content");
var group = element("group");

var enviarAction;

var produtoCounter = 0;
var pessoasCounter = 0;
var grupoCounter = 1;

function enviar(){
	enviarAction();
	fechaDialog();
}

function dialog(dialog, text){
	return {element: dialog, text: text};
}

function mostraDialog(dialog, msg, callback){
	dialog.text.innerHTML=msg;
	dialog.element.style.display="block";
	enviarAction = callback;
}

function renderizaAll(){
	calcularPrecos();
	renderizaValorTotal();
	renderizaPessoas();
	renderizaGroup();
}

function renderizaPessoas(){
	content.innerHTML="";
	for(var i = 0; i < pessoas.length; i++){
		content.innerHTML+=`
			<div class="person">
				<div class="name">`+pessoas[i].nome+` - <span>R$`+(Math.round((pessoas[i].total*1.1) * 100) / 100)+`</span></div>
				`+geraProdutos(pessoas[i].produtos, false, pessoas[i].id)+`
			</div>
		`;
	}
}

function renderizaDialogGrupo(){
	dialogGrupoSelect.innerHTML="";
	for(var i = 0; i < pessoas.length; i++){
		dialogGrupoSelect.innerHTML+=`
			<option value="`+pessoas[i].id+`">`+pessoas[i].nome+`</option>
		`;
	}
}

function renderizaValorTotal(){
	var valorTotal = 0;
	pessoas.forEach(function(pessoa){
		valorTotal += pessoa.total;
		console.log(valorTotal)
	});
	if(valorTotal > 0){
		results.style.display="block";
	}
	total.innerHTML = Math.round(valorTotal * 1.1 * 100) / 100;
}

function renderizaDialogSelecionaGrupo(){
	dialogGrupoSelect.innerHTML="";
	for(var i = 0; i < grupos.length; i++){
		dialogGrupoSelect.innerHTML+=`
			<option value="`+grupos[i].id+`">`+grupos[i].nome+`</option>
		`;
	}
}

function renderizaGroup(){
	group.innerHTML=geraProdutos(produtosGrupo, true, 0);
}

function geraProdutos(listaProdutos, grupo, id){
	var retorno = '<div class="icons">';
	for(var i = 0; i < listaProdutos.length; i++){
		retorno += `
				<div class="icon" counter="`+listaProdutos[i].quantidade+`" 
				desc="`+listaProdutos[i].nome + ' - R$' + listaProdutos[i].preco +`"
				onclick="`+(grupo ? 'incrementaGrupo' : 'incrementaPessoa')+`(`+id+`,`+listaProdutos[i].id+`)">
					<i class="fas fa-`+listaProdutos[i].tipo+`"></i>
				</div>
				`;
	}
	retorno += "</div>";
	return retorno;
}

function incrementaGrupo(idGrupo, idProduto){
	renderizaDialogSelecionaGrupo();
	mostraDialog(
		dialog(dialogGrupo, dialogGrupoText), 
			"Selecione o grupo para adicionar o produto!",
			function(){
				idGrupo = dialogGrupoSelect.value;
				grupos.forEach(function(grupo){
					if(grupo.id == idGrupo){
						grupo.produtos.forEach(function(produto){
							if(produto.id == idProduto){
								produto.quantidade++;
							}
						});
					}
				});
				renderizaAll();
			}
	);
}

function incrementaPessoa(idPessoa, idProduto){
	pessoas.forEach(function(pessoa){
		if(pessoa.id == idPessoa){
			pessoa.produtos.forEach(function(produto){
				if(produto.id == idProduto){
					produto.quantidade++;
				}
			});
		}
	});
	renderizaAll();
}

function limpaCampos(){
	pessoaNomeInput.value="";
	comidaNomeInput.value="";
	comidaPrecoInput.value="";
}

function fechaDialog(){
	limpaCampos();
	dialogPessoa.style.display="none";
	dialogComida.style.display="none";
	dialogGrupo.style.display="none";
}

function addProduto(produto){
	produtos.push(clone(produto));
	pessoas.forEach(function(pessoa){
		pessoa.produtos.push(clone(produto));
	});
	grupos.forEach(function(grupo){
		grupo.produtos.push(clone(produto));
	});
}

function addPessoa(){
	mostraDialog(
		dialog(dialogPessoa, dialogPessoaText),
		"Digite o nome do novo participante!",
		function(){
			pessoas.push({
				id: pessoasCounter++,
				nome: pessoaNomeInput.value,
			 	produtos: cloneList(produtos),
			  	total: 0
			});
			renderizaPessoas();
		}
	);
}

function cloneList(lista){
	var retorno = [];
	for(var i = 0; i < lista.length; i++){
		retorno.push(clone(lista[i]));
	}
	return retorno;
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function addComida(){
	mostraDialog(
		dialog(dialogComida, dialogComidaText), 
		"Digite os dados do prato!",
		function(){
			addProduto({
				id: produtoCounter++,
				nome: comidaNomeInput.value,
				preco: comidaPrecoInput.value,
				tipo: 'utensils',
				quantidade: 0
			});
			renderizaAll();
		}
	);
}

function addDrink(){
	mostraDialog(
		dialog(dialogComida, dialogComidaText), 
		"Digite os dados da bebida!",
		function(){
			addProduto({
				id: produtoCounter++,
				nome: comidaNomeInput.value,
				preco: comidaPrecoInput.value,
				tipo: 'beer',
				quantidade: 0
			});
			renderizaAll();
		}
	);
}

function addGroup(){
	renderizaDialogGrupo();
	mostraDialog(
		dialog(dialogGrupo, dialogGrupoText), 
			"Selecione os membros do grupo!",
			function(){
				var pessoasSelecionadas = getPessoas(getSelectValues(dialogGrupoSelect));
				var nome = "";
				for(var i = 0; i < pessoasSelecionadas.length; i++){
					nome += pessoasSelecionadas[i].nome;
					if(i != pessoasSelecionadas.length - 1){
						nome += " / ";
					}
				}
				grupos.push({
					id: grupoCounter++,
					nome: nome,
					produtos: produtos, 
					pessoas: pessoasSelecionadas
				});
				renderizaAll();
			}
	);
}

function getSelectValues(select){
  	var result = [];
  	var options = select && select.options;
  	var opt;

  	for (var i=0, iLen=options.length; i<iLen; i++) {
    	opt = options[i];

    	if (opt.selected) {
			result.push(opt.value || opt.text);
		}
	}
	return result;
}

function getPessoas(list){
	var pessoasSelecionadas = [];
	pessoas.forEach(function(pessoa){
		list.forEach(function(id){
			if(pessoa.id == id){
				pessoasSelecionadas.push(pessoa);
			}
		})
	});
	return pessoasSelecionadas;
}

function calcularPrecos(){
	var totalDivisao = 0;
	todos.produtos.forEach(function(produto){
		if(produto.quantidade > 0){
			totalDivisao += produto.preco*produto.quantidade;
		}
	});
	totalDivisao = totalDivisao/pessoas.length;
	pessoas.forEach(function(pessoa){
		var total = 0;
		grupos.forEach(function(grupo){
			grupo.pessoas.forEach(function(pessoaGrupo){
				if(pessoaGrupo.id == pessoa.id){
					total += precoTotalProdutos(grupo.produtos)/grupo.pessoas.length;
				}
			});
		});
		total += precoTotalProdutos(pessoa.produtos);
		pessoa.total = total;
	});
}

function precoTotalProdutos(produtos){
	var total = 0;
	produtos.forEach(function(produto){
		total += produto.preco*produto.quantidade;
	});
	return total;
}