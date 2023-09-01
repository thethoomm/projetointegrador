
const API_KEY = "e487e13afb9a450fb11bea48e503d1ba"
const topico = "meio+ambiente" // Criar uma lista de tópicos para serem sorteados diariamente
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
const visualizacoesMaximasDeNoticas = 12
const listaDeNoticias = []

fetch(API_URL).then(async response => {
    const dadosDaApi = await response.json()
    const artigos = await dadosDaApi.articles
    console.info(artigos)
    for (let i = 0; i < visualizacoesMaximasDeNoticas; i++) {
        const artigo = artigos[i]

        // Verificação do tamanho ideal do título 
        while (String(artigo.title).length > 70) {
            artigo.title = artigo.title.substring(0, artigo.title.length - 1)
        }
        const noticia = {
            titulo: artigo.title,
            descricao: artigo.description,
            data: formatarDataNotica(artigo.publishedAt),
            imagem: artigo.urlToImage,
            link: artigo.url
        }
        if (noticia.titulo == null || noticia.descricao == null || noticia.imagem == null) {
            continue
        }
        console.log(noticia)
        listaDeNoticias.push(noticia)
    }
    console.log(listaDeNoticias.length == visualizacoesMaximasDeNoticas)
    renderizarNoticias()
})


const renderizarNoticias = () => {
    const noticias = document.querySelector(".noticias-block")
    noticias.innerHTML = ""
    for (let i = 0; i < listaDeNoticias.length; i++) {
        const noticia = listaDeNoticias[i]
        
        const noticiaHtml = `
        <div class="card-noticia">
            <div class="noticia-img"></div>
            <div class="noticia-conteudo">
                <h2 class="noticia-titulo">${noticia.titulo}</h2>
                <p class="noticia-descricao">${noticia.descricao}</p>
                <a href="${noticia.link}" class="noticia-link">Leia mais</a>
                <p class="noticia-data">${noticia.data}</p>
            </div>
        </div>
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