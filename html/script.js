const urlParams = new URLSearchParams(window.location.search);
const produtoId = urlParams.get('id');

// Exemplo: mostrar o nome do produto
if (produtoId) {
  document.getElementById('titulo-produto').textContent = `Você está comprando: ${produtoId}`;
}

document.addEventListener('DOMContentLoaded', () => {
  let itensNoCarrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

  // Atualizado para funcionar com o novo cabeçalho
  const elementoContador = document.getElementById("contador-carrinho");
  const modal = document.getElementById('modal-carrinho');
  const abrirModalBtn = document.querySelector('.carrinho'); // agora é uma div com classe
  const fecharModalBtn = document.querySelector('#modal-carrinho .close-button');
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

  function abrirModal() {
    atualizarModal();
    modal.style.display = 'flex';
  }

  function fecharModal() {
    modal.style.display = 'none';
  }

  if (abrirModalBtn && modal) {
    abrirModalBtn.addEventListener('click', abrirModal);
  }

  if (fecharModalBtn && modal) {
    fecharModalBtn.addEventListener('click', fecharModal);
  }

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      fecharModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.style.display === 'flex') {
      fecharModal();
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

  // Banner rotativo
  const imagensBanner = [
    "https://down-br.img.susercontent.com/file/9fe3aa3d22cf3eec4e46157967a48f38",
    "https://cf.shopee.com.br/file/1932d8aaf0f1fe7ca840facfa320405b",
    "https://down-br.img.susercontent.com/file/f0ee1949de8e6963e2bbdfeeb9a03903"
  ];

  let slideIndex = 0;

  function showSlides() {
    const banner = document.getElementById('banner-slide');

    slideIndex++;
    if (slideIndex >= imagensBanner.length) {
      slideIndex = 0;
    }

    if (banner) {
      banner.src = imagensBanner[slideIndex];
    }

    setTimeout(showSlides, 3000);
  }

  // Inicialização
  calcularTotais();
  showSlides();
});
