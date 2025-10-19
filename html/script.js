document.addEventListener('DOMContentLoaded', () => {
  // === PARÂMETROS DE URL ===
  const urlParams = new URLSearchParams(window.location.search);
  const produtoId = urlParams.get('id');
  if (produtoId) {
    const titulo = document.getElementById('titulo-produto');
    if (titulo) {
      titulo.textContent = `Você está comprando: ${produtoId}`;
    }
  }

  // === MODAL DE LOGIN ===
  const abrirLoginBtn = document.getElementById('abrir-login');
  const fecharLoginBtn = document.getElementById('fechar-login');
  const modalLogin = document.getElementById('modal-login');

  abrirLoginBtn.addEventListener('click', () => {
    modalLogin.style.display = 'flex';
  });

  fecharLoginBtn.addEventListener('click', () => {
    modalLogin.style.display = 'none';
  });

  window.fazerLogin = function () {
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    const mensagem = document.getElementById('mensagem-login');

    if (usuario === 'admin' && senha === '1234') {
      mensagem.textContent = 'Login realizado com sucesso!';
      mensagem.style.color = 'green';
      setTimeout(() => {
        modalLogin.style.display = 'none';
      }, 1500);
    } else {
      mensagem.textContent = 'Usuário ou senha incorretos.';
      mensagem.style.color = 'red';
    }
  };

  // === MODAL DO CARRINHO ===
  let itensNoCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const elementoContador = document.getElementById("contador-carrinho");
  const modalCarrinho = document.getElementById('modal-carrinho');
  const abrirCarrinhoBtn = document.querySelector('.carrinho');
  const fecharCarrinhoBtn = document.querySelector('#modal-carrinho .close-button');
  const listaCarrinho = document.getElementById('lista-carrinho');
  const valorTotalSpan = document.getElementById('valor-total');
  const botoesComprar = document.querySelectorAll('.btn-comprar');

  function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(itensNoCarrinho));
  }

  function calcularTotais() {
    let total = 0;
    let contagemItens = 0;

    itensNoCarrinho.forEach(item => {
      total += item.preco * item.quantidade;
      contagemItens += item.quantidade;
    });

    if (valorTotalSpan) {
      valorTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
    if (elementoContador) {
      elementoContador.textContent = contagemItens;
    }
  }

  function atualizarModal() {
    listaCarrinho.innerHTML = '';
    calcularTotais();

    if (itensNoCarrinho.length === 0) {
      listaCarrinho.innerHTML = '<p>Seu carrinho está vazio.</p>';
    } else {
      itensNoCarrinho.forEach((item, i) => {
        const itemHTML = document.createElement('div');
        itemHTML.classList.add('item-carrinho');

        const precoTotal = (item.preco * item.quantidade).toFixed(2).replace('.', ',');

        itemHTML.innerHTML = `
          <span>${item.nome} (${item.quantidade}x)</span>
          <span class="item-info">
            R$ ${precoTotal}
            <button onclick="removerDoCarrinhoPorIndice(${i})" class="btn-remover">Remover</button>
          </span>
        `;
        listaCarrinho.appendChild(itemHTML);
      });
    }
  }

  window.removerDoCarrinhoPorIndice = function(index) {
    itensNoCarrinho.splice(index, 1);
    salvarCarrinho();
    atualizarModal();
  };

  function adicionarAoCarrinho(nome, preco, id) {
    const precoFloat = parseFloat(preco);
    const itemExistente = itensNoCarrinho.find(item => item.id === id);

    if (itemExistente) {
      itemExistente.quantidade += 1;
    } else {
      itensNoCarrinho.push({ id, nome, preco: precoFloat, quantidade: 1 });
    }

    salvarCarrinho();
    calcularTotais();
  }

  function abrirCarrinho() {
    atualizarModal();
    modalCarrinho.style.display = 'flex';
  }

  function fecharCarrinho() {
    modalCarrinho.style.display = 'none';
  }

  if (abrirCarrinhoBtn && modalCarrinho) {
    abrirCarrinhoBtn.addEventListener('click', abrirCarrinho);
  }

  if (fecharCarrinhoBtn && modalCarrinho) {
    fecharCarrinhoBtn.addEventListener('click', fecharCarrinho);
  }

  window.addEventListener('click', (event) => {
    if (event.target === modalCarrinho) {
      fecharCarrinho();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalCarrinho.style.display === 'flex') {
      fecharCarrinho();
    }
  });

  botoesComprar.forEach(botao => {
    botao.addEventListener('click', (evento) => {
      const cardProduto = evento.target.closest('.card-produto');
      const nomeProduto = cardProduto.querySelector('h3').textContent.trim();
      const preco = botao.getAttribute('data-preco');
      const id = cardProduto.getAttribute('data-id') || nomeProduto;

      if (nomeProduto && preco) {
        adicionarAoCarrinho(nomeProduto, preco, id);
      }
    });
  });

  // === BANNER ROTATIVO ===
  const imagensBanner = [
    "https://down-br.img.susercontent.com/file/9fe3aa3d22cf3eec4e46157967a48f38",
    "https://cf.shopee.com.br/file/1932d8aaf0f1fe7ca840facfa320405b",
    "https://down-br.img.susercontent.com/file/f0ee1949de8e6963e2bbdfeeb9a03903"
  ];

  let slideIndex = 0;

  function showSlides() {
    const banner = document.getElementById('banner-slide');
    slideIndex = (slideIndex + 1) % imagensBanner.length;
    if (banner) {
      banner.src = imagensBanner[slideIndex];
    }
    setTimeout(showSlides, 3000);
  }

  // === BUSCA COM RESULTADOS DINÂMICOS ===
  const campoPesquisa = document.getElementById("campo-pesquisa");
  const botaoPesquisa = document.getElementById("botao-pesquisa");
  const produtos = document.querySelectorAll(".card-produto");
  const resultados = document.getElementById("resultados-pesquisa");
  

  campoPesquisa.addEventListener("input", function () {
    
    const termo = campoPesquisa.value.toLowerCase();
    resultados.innerHTML = "";

    if (termo.length === 0) {
      resultados.style.display = "none";
      return;
    }

    let encontrados = 0;

    produtos.forEach(produto => {
      const nome = produto.querySelector("h3").textContent.toLowerCase();
      if (nome.includes(termo)) {
        const item = document.createElement("div");
        item.textContent = nome;
        item.addEventListener("click", () => {
          produto.scrollIntoView({ behavior: "smooth" });
          resultados.style.display = "none";
        });
        resultados.appendChild(item);
        encontrados++;
      }
    });

    resultados.style.display = encontrados > 0 ? "block" : "none";
  });

  botaoPesquisa.addEventListener("click", () => {
    campoPesquisa.dispatchEvent(new Event("input"));
  });

  // === MENU RESPONSIVO ===
  const itens = document.getElementById("itens");

  window.clickMenu = function () {
    itens.style.display = itens.style.display === 'block' ? 'none' : 'block';
  };

  window.mudouTamanho = function () {
    itens.style.display = window.innerWidth >= 992 ? 'block' : 'none';
  };

  // === POPUP DE DESCONTO ===
  const popup = document.getElementById('popup-desconto');
  const fecharPopup = document.querySelector('.fechar-popup');

  if (popup && fecharPopup) {
    popup.classList.add('mostrar');
    fecharPopup.addEventListener('click', () => {
      popup.classList.remove('mostrar');
    });
  }

  // === SCROLL HORIZONTAL NOS PRODUTOS ===
  const grade = document.querySelector('.grade-produtos');
  let isDown = false;
  let startX;
  let scrollLeft;

  grade.addEventListener('mousedown', (e) => {
    isDown = true;
    grade.classList.add('active');
    startX = e.pageX - grade.offsetLeft;
    scrollLeft = grade.scrollLeft;
  });

    grade.addEventListener('mouseleave', () => {
    isDown = false;
    grade.classList.remove('active');
  });

  grade.addEventListener('mouseup', () => {
    isDown = false;
    grade.classList.remove('active');
  });

  grade.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - grade.offsetLeft;
    const walk = (x - startX) * 1.5; // velocidade
    grade.scrollLeft = scrollLeft - walk;
  });

  // === INICIALIZAÇÕES FINAIS ===
  calcularTotais();
  showSlides();
});
