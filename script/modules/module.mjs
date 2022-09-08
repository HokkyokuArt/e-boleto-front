//<==================== Create popup ====================> //
function createElement(type, message, parentElement) {
    const divBlock = $('#div-block')
    let createDiv = document.createElement("div")
    parentElement.appendChild(createDiv)
    parentElement.lastChild.setAttribute('class', `create-element ${type}`)
    const div = $(`.${type}`)

    if (type === `error`) {
        div.innerHTML = `<p>${message}</p> <i class="fa-solid fa-triangle-exclamation"></i>`
        animationDiv(100, div)
        removeDiv(3000, div, parentElement)
    } else if (type === `success`) {
        div.innerHTML = `<p>${message}</p> <i class="fa-solid fa-check"></i>`
        animationDiv(100, div)
        removeDiv(3000, div, parentElement)
    } else if (type === `confirmation`) {
        divBlock.style.display = 'block'

        let p = document.createElement('p')
        let divContainerBtns = document.createElement('div')
        let buttonConfirm = document.createElement('button')
        let buttonCancel = document.createElement('button')
        let iconYes = document.createElement('i')
        let iconNo = document.createElement('i')

        iconNo.classList.add('fa-solid', 'fa-xmark')
        iconYes.classList.add('fa-solid', 'fa-check')

        divContainerBtns.classList.add('container-btns')

        buttonCancel.setAttribute('id', 'btn-cancel')
        buttonConfirm.setAttribute('id', 'btn-confirm')

        p.textContent = message
        buttonCancel.appendChild(iconNo)
        buttonConfirm.appendChild(iconYes)

        divContainerBtns.appendChild(buttonCancel)
        divContainerBtns.appendChild(buttonConfirm)

        div.appendChild(p)
        div.appendChild(divContainerBtns)

        animationDiv(100, div)

    } else if (type === 'information-boleto') {
        divBlock.style.display = 'block'

        let divIconEsc = document.createElement('div')
        let iconEsc = document.createElement('i')
        let divP = document.createElement('div')
        let p = document.createElement('p')
        let divIconPrint = document.createElement('div')
        let iconPrint = document.createElement('i')
        let code = document.createElement('p')

        iconEsc.setAttribute('id', 'esc')
        iconEsc.classList.add('fa-solid', 'fa-xmark')
        iconPrint.setAttribute('id', 'print')
        iconPrint.classList.add('fa-solid', 'fa-print')
        code.setAttribute('id', 'code')

        let array = []
        for (let i = 0; i < 33; i++) {
            array.push(numberRandom(0, 9))
        }
        let boletoCode = array.join('')

        p.textContent = boletoCode
        code.textContent = boletoCode.substring(0, 14)

        divIconEsc.appendChild(iconEsc)
        divP.appendChild(p)
        divP.appendChild(code)
        divIconPrint.appendChild(iconPrint)

        div.appendChild(divIconEsc)
        div.appendChild(divP)
        div.appendChild(divIconPrint)

        animationDiv(100, div)
    }

}

function animationDiv(time, element) {
    setTimeout(() => {
        element.classList.add('visible-div')
    }, time)
}

function removeDiv(time, element, parentElement) {
    setTimeout(() => {
        element.classList.remove('visible-div')
    }, time)
    setTimeout(() => {
        parentElement.removeChild(element)

    }, time + 500)
}

function animation(btn, animateBoolean, animation) {
    if (!animateBoolean) {
        animateBoolean = true
        btn.classList.add(animation)
        setTimeout(() => {
            btn.classList.remove(animation)
            animateBoolean = false
        }, 1000)
    }
}

function numberRandom(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

//<==================== Make request ====================> //
async function request(endPoint, method, body) {
    const baseUrl = `http://localhost:8080/`
    const headersList = {
        "Accept": "*/*",
        "Content-Type": "application/json"
    }
    const bodyContent = JSON.stringify(body);

    try {
        let response = await fetch(`${baseUrl + endPoint}`, {
            method: method,
            body: bodyContent,
            headers: headersList
        });

        let data = await response.json()
        return data

    } catch (e) {
        return e
    }
}

//<==================== ??  :)  ?? ====================> //
function $(tag) {
    return document.querySelector(tag);
}
function $A(tag) {
    return document.querySelectorAll(tag);
}

export { createElement, request, $, animation, removeDiv, $A}
