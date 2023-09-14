
const API_KEY = "e487e13afb9a450fb11bea48e503d1ba"
const topico = "biodiversidade" //ecologia // Criar uma lista de tópicos para serem sorteados diariamente
const DIAS_DE_ATUALIZACAO = 1 // 31 - Quntidade máxima de dias que a API será atualizada
const dataSemFormat = new Date().toISOString().replace (/[^0-9]/g, ' ').split(" ")
console.log(dataSemFormat)
let dia = Number(dataSemFormat[2]) - DIAS_DE_ATUALIZACAO
console.log("Dia: " + dia)
let mes = Number(dataSemFormat[1])
let ano = Number(dataSemFormat[0])
if (dia < 1) {
    dia = 31 + dia
    mes -= 1
} else if (mes < 1) {
    mes = 12 
    ano -= 1
}
const data = `${ ano }-${ '0' + String(mes) }-${ String(dia) < 10 ? '0' + String(dia) : String(dia)  }`
console.log(data)
const API_URL = `https://newsapi.org/v2/everything?q=${topico}&language=pt&from=${data}&apiKey=${API_KEY}`
let visualizacoesMaximasDeNoticas = 2
let listaDeNoticias = []

const botaoVerMais = document.querySelector(".ver-mais-btn")
let vendo = true
botaoVerMais.addEventListener("click", () => {
    if (vendo) {
        botaoVerMais.innerHTML = "Ver menos"
        vendo = false
        visualizacoesMaximasDeNoticas = visualizacoesMaximasDeNoticas * 2 + 1
        listaDeNoticias = []
    } else {
        botaoVerMais.innerHTML = "Ver mais"
        vendo = true
        visualizacoesMaximasDeNoticas = 2
        listaDeNoticias = []
    }
    chamadaAPI(visualizacoesMaximasDeNoticas)
})



const chamadaAPI = async (visualizacao) => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Erro na resposta da API');
        }
        
        const dadosDaApi = await response.json();
        const artigos = dadosDaApi?.articles || [];

        for (let i = 0; i < Math.min(visualizacao + 1, artigos.length); i++) {
            const artigo = artigos[i];
            if (!artigo || !artigo.title || !artigo.description || !artigo.urlToImage) {
                continue;
            }

            let titulo = artigo.title;
            let descricao = artigo.description;
            // Verifique o tamanho ideal do título
            while (String(titulo).length > 70) {
                titulo = titulo.substring(0, String(titulo).lastIndexOf(" "))
            }
            titulo += "."
            while (String(descricao).length > 120) {
                descricao = descricao.substring(0, String(descricao).lastIndexOf(" "))
            }
            descricao += "."

            const noticia = {
                titulo: titulo,
                descricao: descricao,
                data: formatarDataNotica(artigo.publishedAt),
                imagem: artigo.urlToImage,
                link: artigo.url,
            };

            listaDeNoticias.push(noticia);
        }

        console.log(listaDeNoticias.length === visualizacoesMaximasDeNoticas);
        renderizarNoticias();
    } catch (error) {
        console.error('Erro na chamada da API:', error);
    }
};


chamadaAPI(visualizacoesMaximasDeNoticas)

const renderizarNoticias = () => {
    const noticias = document.querySelector("#noticias-block")
    noticias.innerHTML = ""
    for (let i = 0; i < listaDeNoticias.length; i++) {
        const noticia = listaDeNoticias[i]
        
        const noticiaHtml = `
        <article class="card-noticia">
            <div class="noticia-img"></div>
            <div class="noticia-conteudo">
                <h2 class="noticia-titulo">${noticia.titulo}</h2>
                <p class="noticia-descricao">${noticia.descricao}</p>
                <a href="${noticia.link}" class="noticia-link">Leia mais</a>
                <p class="noticia-data">${noticia.data}</p>
            </div>
        </article>
        `
        noticias.innerHTML += noticiaHtml
    }
    renderizarImagens()
}

const renderizarImagens = () => {
    const imagens = document.querySelectorAll(".noticia-img")
    imagens.forEach((imagem, index) => {
        console.log(imagem)
        console.log(listaDeNoticias[index].imagem)
        imagem.style.backgroundImage = `url("${listaDeNoticias[index].imagem}")`
    })
}

const formatarDataNotica = (data) => {
    const dataSemFormat = new Date(data).toISOString().replace (/[^0-9]/g, ' ').split(" ")
    const dia = dataSemFormat[2]
    const mes = dataSemFormat[1]
    const ano = dataSemFormat[0]
    const dataFormatada = `${dia}/${mes}/${ano}`
    return dataFormatada
}
