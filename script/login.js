import { createElement, request, $ } from "./modules/module.mjs"

//<==================== Map Elements ====================> //
const loginPage = $('#login-page')
const inputEmail = $(".div-input > #input-email")
const inputPassWord = $(".div-input-password > #input-password")
const icon = $('.div-input-password > .icon')
const btnSubmit = $('.div-btn > button')

// <==================== Interface ====================> //

// Show password
let iconCondition = false
icon.addEventListener('click', () => {
    if (!iconCondition) {
        icon.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`
        iconCondition = true
        inputPassWord.type = 'text'
    } else {
        icon.innerHTML = `<i class="fa-solid fa-eye"></i>`
        iconCondition = false
        inputPassWord.type = 'password'
    }
})

// Button Submit
let animation = false;
btnSubmit.addEventListener('mouseover', () => {
    if (!animation) {
        animation = true
        btnSubmit.classList.add('coin-check-animation')
        setTimeout(() => {
            btnSubmit.classList.remove('coin-check-animation')
            animation = false
        }, 1000)
    }
})

// <==================== Request Login ====================> //
btnSubmit.addEventListener('click', (e) => {
    e.preventDefault()
    clickBtnSubmit()

})

document.addEventListener('keypress', (e) => {
    if (e.which == 13) {
        e.preventDefault()
        clickBtnSubmit()
    }
}, false)

function clickBtnSubmit() {
    let email = inputEmail.value
    let password = inputPassWord.value
    if (!email || !password) {
        createElement(`error`, `Preencha todos os campos corretamente para entrar.`, loginPage)
    } else {
        let endPoint = `cliente/login/email=${email}&senha=${password}`
        verifyLogin(endPoint)
    }
}

const verifyLogin = (endPoint) => {
    request(endPoint, `GET`).then((response) => {
        if (response == `SyntaxError: Unexpected end of JSON input`) {
            createElement(`error`, `Usuário ou senha inválidos`, loginPage)
        } else if (response == `TypeError: Failed to fetch`) {
            createElement(`error`, 'Falha na conexão com o servidor. Por favor entre em contato com o suporte.', loginPage)
        } else {
            localStorage.setItem(`user`, JSON.stringify(response))
            inputEmail.value = ''
            inputPassWord.value = ''
            window.location.href = `./meus-boletos.html`
        }
    })
}