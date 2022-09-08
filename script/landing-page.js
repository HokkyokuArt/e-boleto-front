import { $ } from "./modules/module.mjs";

const btn = $('.btn')
const main = $('main')

let modifyTitle = false
btn.addEventListener('click', () => {
    main.classList.toggle('scroll-to-login');
    btn.classList.toggle('change-btn');
    if(!modifyTitle){
        document.title = 'E-Boleto | Login'
        modifyTitle = true
    } else {
        document.title = 'E-Boleto | Página inicial'
        modifyTitle = false
    }
})

