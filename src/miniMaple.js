class MiniMaple{
     diff(input) {
        const parts = input.split(',')
        if (parts.length !== 2) {
            throw new Error("Неверный формат! Ожидается выражение вида: \"полином, переменная\"")
        }

        let pol = parts[0].trim()
        const targetVar = parts[1].trim()

         if (!/^[a-zA-Z]+$/.test(targetVar)) {
             throw new Error("Неверный формат! Целевая переменная должна содержать только буквы")
         }

        if (/[^a-zA-Z0-9\s+\-*^]/.test(pol)) {
            throw new Error("Неверный ввод! Обнаружены недопустимые символы")
        }

        pol = pol.replace(/\s+/g, '')
        pol = pol.replace(/(?<!^)(?<!\+)-/g, '+-')

        const variables = pol.split('+')

        const diffVars = variables.map(variable => {
            if (!variable) return 0

            let coeffStr = ''
            let varName
            let expStr
            const letterMatch = variable.match(/[a-zA-Z]+/)

            if (letterMatch) {
                varName = letterMatch[0]

                const parts = variable.split(varName)

                if (parts.length > 2) {
                    throw new Error(`Слагаемое не приведено к каноническому виду (дублирование переменной): ${variable}`)
                }

                if (parts[1] && !/^(\^\d+)?$/.test(parts[1])) {
                    throw new Error(`Обнаружены смешанные переменные или неверный формат степени: ${variable}`)
                }

                coeffStr = parts[0].replace('*', '')

                if (parts[1]) {
                    expStr = parts[1].replace('^', '')
                }
            } else {
                coeffStr = variable
            }

            if (varName !== targetVar) return 0

            let coeff = 1
            if (coeffStr === '-') coeff = -1
            else if (coeffStr === '+') coeff = 1
            else if (coeffStr !== '') coeff = parseInt(coeffStr, 10)

            let power = expStr !== undefined ? parseInt(expStr, 10) : 1

            const newCoeff = coeff * power
            const newPower = power - 1

            if (newCoeff === 0) return 0

            if (newPower === 0) {
                return newCoeff.toString()
            }

            let resStr = ''
            if (newCoeff === -1) resStr = '-'
            else if (newCoeff !== 1) resStr = `${newCoeff}*`

            resStr += varName
            if (newPower > 1) resStr += `^${newPower}`

            return resStr
        })

        const resArr = diffVars.filter(t => t !== 0)

        if (resArr.length === 0) return '0'

        let result = resArr[0]
        for (let i = 1; i < resArr.length; i++) {
            const tmp = resArr[i]
            if (tmp.startsWith('-')) {
                result += ` - ${tmp.slice(1)}`
            } else {
                result += ` + ${tmp}`
            }
        }

        return result
    }
}

export {MiniMaple}