import {MiniMaple} from "./miniMaple.js"

document.addEventListener('DOMContentLoaded', setup)

function setup() {
    document.getElementById('calcButton').onclick = calculateDerivative
}

function calculateDerivative() {
    const inputField = document.getElementById('expressionInput')
    const resultField = document.getElementById('resultOutput')
    const errorAlert = document.getElementById('errorAlert')

    resultField.value = ''
    errorAlert.classList.add('d-none')
    errorAlert.textContent = ''

    const input = inputField.value

    try {
        const maple = new MiniMaple()
        resultField.value = maple.diff(input)
    } catch (error) {
        errorAlert.textContent = error.message
        errorAlert.classList.remove('d-none')
    }
}