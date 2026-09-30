const form = document.getElementById("formItem");

const nome = document.getElementById("nome");
const categoria = document.getElementById("categoria");
const estado = document.getElementById("estado");
const tipo = document.getElementById("tipo");
const descricao = document.getElementById("descricao");
const responsavel = document.getElementById("responsavel");

const listaItens = document.getElementById("listaItens");

const mensagem = document.getElementById("mensagem");

const pesquisa = document.getElementById("pesquisa");
const filtroCategoria = document.getElementById("filtroCategoria");
const filtroSituacao = document.getElementById("filtroSituacao");
const filtroTipo = document.getElementById("filtroTipo");

const totalItens = document.getElementById("totalItens");
const totalDisponiveis = document.getElementById("totalDisponiveis");
const totalReservados = document.getElementById("totalReservados");
const totalDoacoes = document.getElementById("totalDoacoes");

const semResultado = document.getElementById("semResultado");

let itens = [];

document.addEventListener("DOMContentLoaded", () => {

    const dados = localStorage.getItem("itensFeira");

    if (dados) {
        itens = JSON.parse(dados);
    }

    renderizar();

});

form.addEventListener("submit", cadastrarItem);

function cadastrarItem(event) {

    event.preventDefault();

    if (
        nome.value.trim() === "" ||
        categoria.value === "" ||
        tipo.value === ""
    ) {

        mostrarMensagem(
            "Preencha todos os campos obrigatórios.",
            true
        );

        return;
    }

    const itemExistente = itens.some(item =>
        item.nome.toLowerCase() ===
        nome.value.toLowerCase()
    );

    if (itemExistente) {

        mostrarMensagem(
            "Já existe um item com este nome.",
            true
        );

        return;
    }

    const novoItem = {

        id: Date.now(),

        nome: nome.value,

        categoria: categoria.value,

        estado: estado.value,

        tipo: tipo.value,

        descricao: descricao.value,

        responsavel: responsavel.value,

        reservado: false

    };

    itens.push(novoItem);

    salvarDados();

    form.reset();

    mostrarMensagem(
        "Item cadastrado com sucesso!"
    );

    renderizar();

}

function renderizar() {

    listaItens.innerHTML = "";

    const textoPesquisa =
        pesquisa.value.toLowerCase();

    const itensFiltrados = itens.filter(item => {

        const pesquisaOk =
            item.nome.toLowerCase().includes(textoPesquisa) ||
            item.descricao.toLowerCase().includes(textoPesquisa);

        const categoriaOk =
            filtroCategoria.value === "Todos" ||
            item.categoria === filtroCategoria.value;

        const situacaoOk =
            filtroSituacao.value === "Todos" ||
            (
                filtroSituacao.value === "Disponível" &&
                !item.reservado
            ) ||
            (
                filtroSituacao.value === "Reservado" &&
                item.reservado
            );

        const tipoOk =
            filtroTipo.value === "Todos" ||
            item.tipo === filtroTipo.value;

        return (
            pesquisaOk &&
            categoriaOk &&
            situacaoOk &&
            tipoOk
        );

    });

    if (itensFiltrados.length === 0) {

        semResultado.classList.remove("oculto");

    } else {

        semResultado.classList.add("oculto");

    }

    itensFiltrados.forEach(item => {

        const card =
            document.createElement("div");

        card.classList.add("card");

        card.classList.add(
            item.reservado
                ? "reservado"
                : "disponivel"
        );

        card.classList.add(
            item.tipo === "Troca"
                ? "troca"
                : "doacao"
        );

        card.innerHTML = `
            <h3>${item.nome}</h3>

            <p>
                <strong>Categoria:</strong>
                ${item.categoria}
            </p>

            <p>
                <strong>Estado:</strong>
                ${item.estado}
            </p>

            <p>
                <strong>Tipo:</strong>
                ${item.tipo}
            </p>

            <p>
                <strong>Descrição:</strong>
                ${item.descricao}
            </p>

            <p>
                <strong>Responsável:</strong>
                ${item.responsavel}
            </p>

            <p>
                <strong>Situação:</strong>
                ${item.reservado
                    ? "Reservado"
                    : "Disponível"}
            </p>

            <div class="acoes">

                <button
                    class="btnReservar"
                    data-id="${item.id}"
                >
                    ${item.reservado
                        ? "Disponibilizar"
                        : "Reservar"}
                </button>

                <button
                    class="btnExcluir"
                    data-id="${item.id}"
                >
                    Excluir
                </button>

            </div>
        `;

        listaItens.appendChild(card);

    });

    atualizarResumo();

}

listaItens.addEventListener("click", event => {

    const id =
        Number(event.target.dataset.id);

    if (
        event.target.classList.contains(
            "btnReservar"
        )
    ) {

        const item =
            itens.find(
                item => item.id === id
            );

        item.reservado =
            !item.reservado;

        salvarDados();

        renderizar();

    }

    if (
        event.target.classList.contains(
            "btnExcluir"
        )
    ) {

        const confirmar =
            confirm(
                "Deseja excluir este item?"
            );

        if (confirmar) {

            itens =
                itens.filter(
                    item => item.id !== id
                );

            salvarDados();

            renderizar();

        }

    }

});

pesquisa.addEventListener(
    "input",
    renderizar
);

filtroCategoria.addEventListener(
    "change",
    renderizar
);

filtroSituacao.addEventListener(
    "change",
    renderizar
);

filtroTipo.addEventListener(
    "change",
    renderizar
);

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter" &&
            document.activeElement === pesquisa
        ) {

            renderizar();

        }

    }
);

function atualizarResumo() {

    totalItens.textContent =
        itens.length;

    totalDisponiveis.textContent =
        itens.filter(
            item => !item.reservado
        ).length;

    totalReservados.textContent =
        itens.filter(
            item => item.reservado
        ).length;

    totalDoacoes.textContent =
        itens.filter(
            item => item.tipo === "Doação"
        ).length;

}

function mostrarMensagem(
    texto,
    erro = false
) {

    mensagem.textContent = texto;

    mensagem.className =
        erro
            ? "erro"
            : "sucesso";

    setTimeout(() => {

        mensagem.textContent = "";

        mensagem.className = "";

    }, 3000);

}

function salvarDados() {

    localStorage.setItem(
        "itensFeira",
        JSON.stringify(itens)
    );

}