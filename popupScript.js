const checkSwift = document.querySelector('input.form-check-input')
const indicatorCheck = document.querySelector('p.indicatorCheck')

chrome.storage.sync.get(['darkMode'], (result) => {
    if (result.darkMode) {
        checkSwift.checked = true
        labelIndicatorCheck(true, indicatorCheck)
    }
    else {
        checkSwift.checked = false
    }
})

checkSwift.addEventListener('change', (ev) => {

    if (checkSwift.checked) {
        labelIndicatorCheck(true, indicatorCheck)

        registerCss()
        reloadTab()

        saveOption(true)
    }
    else {
        labelIndicatorCheck(false, indicatorCheck)

        unregisterCss()
        reloadTab()

        saveOption(false)
    }

})

/* Registra o arquivo de estilo no site */
function registerCss() {
    applyDarkMode()

    return chrome.scripting.registerContentScripts([{
        matches: ["https://ava3.uniube.br/*", "https://sga.uniube.br/*"],
        css: ["style.css"],
        js: ["replaceLogo.js"],
        id: "stylecss"
    }]);
}

/* Remove o registro */
async function unregisterCss() {
    await chrome.scripting.unregisterContentScripts(['stylecss'])
    removeDarkMode()
}

/* Aplica de imediato o estilo na página */
function applyDarkMode() {
    chrome.tabs.query({
        url: "https://ava3.uniube.br/*"
    },
        (tab) => {
            chrome.scripting.insertCSS({
                files: ["style.css"],
                target: {
                    tabId: tab[0].id
                }
            })
        }
    )
}

/* Remove de imdediato o estilo na página */
function removeDarkMode() {
    chrome.tabs.query({
        url: "https://ava3.uniube.br/*"
    },
        (tab) => {
            chrome.scripting.removeCSS({
                files: ["style.css"],
                target: {
                    tabId: tab[0].id
                }
            })
        }
    )
}

/* Salva a opção de escolha */
function saveOption(option) {
    chrome.storage.sync.set({darkMode: option}, ()=> {
        console.log('A opção foi salva!')
    })
}

/* Alterna a label entre ON e OFF */
function labelIndicatorCheck(check, label) {
    if (check) {
        label.style.color = '#3cc75a'
        label.textContent = 'ON'
    }
    else {
        label.style.color = '#c7583c'
        label.textContent = 'OFF'
    }
}

/* Recarrega a página */
function reloadTab() {
    chrome.tabs.query({
        url: "https://ava3.uniube.br/*"
    },
        (tab) => {
            chrome.tabs.reload(tab.id)
        }
    )
}