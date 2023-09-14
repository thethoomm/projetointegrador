class Cidade {
    constructor(nome, tempo, temperatura, temperaturaMaxima, temperaturaMinima) {
        this.nome = nome
        this.tempo = tempo
        this.temperatura = temperatura
        this.temperaturaMaxima = temperaturaMaxima
        this.temperaturaMinima = temperaturaMinima
    }
}

const nomeCidade = "Campinas"
const APIKEY = '13f911840563e00b1cbd889efc5c67ae'


console.log("Procurando...")
fetch(`https://api.openweathermap.org/data/2.5/weather?q=${nomeCidade}&units=metric&appid=${APIKEY}&lang=pt_br`)
    .then(async (response) => {
        const data = await response.json()
        console.log(data)
        const cidade = new Cidade(data.name, data.weather[0].description, data.main.temp, data.main.temp_max, data.main.temp_min)
        console.log(cidade)
        adicionarCidadeHTML(cidade)
    })


function adicionarCidadeHTML(cidade) {
    const div = document.querySelector("#tempo")
    div.innerHTML = `
    <h1>${cidade.nome}</h1>,
    &nbsp<h2>${cidade.tempo}</h2>
    &nbsp&nbsp|&nbsp&nbsp<h3>${cidade.temperatura}°C</h3>
    `

}