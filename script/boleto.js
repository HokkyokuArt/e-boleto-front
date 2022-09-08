import * as module from "./modules/module.mjs"

//<==================== Map Elements ====================> //
const entity = JSON.parse(localStorage.getItem(`user`))
const easterEggLogo = module.$('.div-logo > img')
const easterEggAbout = module.$('.about')
const filter = module.$('.div-filter > ul > .dropdown-list')
const body = module.$('body')
const tbody = module.$('#tbody')
const name = module.$('#name')

//<==================== Interface ====================> //

// Easter egg
easterEggLogo.addEventListener('click', () => {
    easterEggAbout.classList.toggle('visible')
})

// Set user name
name.textContent = firstName(entity.razaosocialnome)
function firstName(name) {
    for (let letter of name) {
        if (letter === ' ') {
            return name.substring(0, name.indexOf(letter))
        }
    }
    return name
}

//<==================== Request init ====================> //
makeGetRequest(`cliente/${entity.id}/meus-boletos/abertos`)

//<==================== Filter ====================> //
filter.addEventListener('click', () => {
    let dropdown = filter.parentElement.querySelector('.dropdown')
    let aux = filter.textContent
    filter.textContent = dropdown.textContent
    dropdown.textContent = aux

    if (dropdown.textContent === `Todos`) {
        tbody.innerHTML = ''
        makeGetRequest(`cliente/${entity.id}/meus-boletos/`)
    } else {
        tbody.innerHTML = ''
        makeGetRequest(`cliente/${entity.id}/meus-boletos/abertos`)
    }
})

//<==================== Click on the line ====================> //
function clickTr() {
    const tr = module.$A('tr')
    tr.forEach((line) => {
        line.addEventListener('click', ({ target }) => {
            if (target.innerHTML !== '') {
                module.createElement(`information-boleto`, `Teste`, body)
                const divBlock = module.$('#div-block')
                const div = module.$(`.information-boleto`)
                const esc = module.$('#esc')
                const print = module.$('#print')

                // divBlock.addEventListener('click', () => {
                //     divBlock.style.display = 'none'
                //     module.removeDiv(0, div, body)
                // })

                esc.addEventListener('click', () => {
                    module.removeDiv(0, div, body)
                    divBlock.style.display = 'none'
                })

                print.addEventListener('click', () => { console.log('Printing . . .') })
            }
        })
    })
}

//<==================== Click on the icon to change the expiration date ====================> //

function clickIconDatePlus() {
    const iconDatePlus = module.$A('td > i')
    iconDatePlus.forEach(icon => {
        icon.addEventListener('click', () => {
            module.createElement(`confirmation`, `Deseja alterar a data de vencimento?`, body)

            const btnCancel = module.$('#btn-cancel')
            const btnConfirm = module.$('#btn-confirm')

            let animate = { animateCancel: false, animateConfirm: false }
            btnCancel.addEventListener('mouseover', () => {
                module.animation(btnCancel, animate.animateCancel, 'coin-check-animation')
            })

            btnConfirm.addEventListener('mouseover', () => {
                module.animation(btnConfirm, animate.animateConfirm, 'coin-check-animation')
            })

            const divBlock = module.$('#div-block')
            const div = module.$(`.confirmation`)

            divBlock.addEventListener('click', () => {
                div.style.animation = 'tilt .25s linear'
                setTimeout(() => {
                    div.style.animation = 'none'
                }, 250);
            })

            btnCancel.addEventListener('click', () => {
                module.removeDiv(0, div, body)
                divBlock.style.display = 'none'
            })

            btnConfirm.addEventListener('click', () => {
                const idBoleto = icon.parentNode.parentNode.firstChild.textContent

                try {
                    module.request(`cliente/${entity.id}/meus-boletos/abertos/alterar-data=${idBoleto}`, `PUT`)
                        .then(() => {
                            tbody.innerHTML = ''
                            makeGetRequest(`cliente/${entity.id}/meus-boletos/abertos`)
                            module.createElement('success', `Data de vencimento alterado com sucesso!`, body)
                        })
                } catch (e) {
                    module.createElement('error', e, body)
                }
                module.removeDiv(0, div, body)
                divBlock.style.display = 'none'
            })
        })
    })
}

//<==================== Functions ====================> //
function makeGetRequest(endpoint) {
    module.request(endpoint).then((response) => {
        if (response == `TypeError: Failed to fetch`) {
            module.createElement(`error`, 'Falha na conexão com o servidor. Por favor entre em contato com o suporte.', body)
        } else {
            createTableLine(response)
            clickTr()
            clickIconDatePlus()
        }
    })
}

function createTableLine(entity) {
    for (let i = 0; i < entity.length; i++) {
        let line = document.createElement('tr')
        let cell = []
        for (let j = 0; j < 5; j++) {
            cell[j] = document.createElement('td')
        }

        line.appendChild(cell[0]).textContent = entity[i].id
        line.appendChild(cell[1]).textContent = entity[i].situacao
        if (entity[i].novovencimento === null) {
            line.appendChild(cell[2]).textContent = dateFormat(entity[i].datavencimento)
        } else {
            line.appendChild(cell[2]).textContent = dateFormat(entity[i].novovencimento)
        }
        line.appendChild(cell[3]).textContent = entity[i].valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        if (!entity[i].alterado) {
            line.appendChild(cell[4]).textContent = `Não`
            if (entity[i].situacao === `Aberto`) {
                let icon = document.createElement('i')
                icon.classList.add('fa-solid', 'fa-calendar-plus')
                cell[4].appendChild(icon)
            }
        } else {
            line.appendChild(cell[4]).textContent = `Sim`
        }

        tbody.appendChild(line)
    }
}

function dateFormat(date) {
    let dd = date.substring(8, 10)
    let mm = date.substring(5, 7)
    let yyyy = date.substring(0, 4)
    return `${dd}/${mm}/${yyyy}`
}