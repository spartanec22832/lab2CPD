class MathSymbol {
    constructor(name) {
        this.name = name
    }
}

class MathNumber {
    constructor(value) {
        this.value = value
    }
}

class Term {
    constructor(k, s, p) {
        this.k = k
        this.s = s
        this.p = p
    }

    diff(symName) {
        if (this.s.name !== symName) {
            return new MathNumber(0)
        }

        return new Term(this.k * this.p, this.s, this.p - 1)
    }
}

class MiniMaple {
    diff(input) {
        const parts = input.split(',')
        if (parts.length !== 2) {
            throw new Error("Неверный формат! Ожидается выражение вида: \"полином, переменная\"")
        }

        const exprStr = parts[0].replace(/\s+/g, '')
        const targetVar = parts[1].trim()

        if (!/^[a-zA-Z]+$/.test(targetVar)) {
            throw new Error("Неверный формат! Целевая переменная должна содержать только буквы")
        }

        if (/[^a-zA-Z0-9+\-*^]/.test(exprStr)) {
            throw new Error("Неверный ввод! Обнаружены недопустимые символы")
        }

        const termRegex = /[+-]?[^+-]+/g
        const termsStr = exprStr.match(termRegex) || []

        const expr = termsStr.map(t => {
            const symMatch = t.match(/[a-zA-Z]+/)

            if (!symMatch) {
                return new MathNumber(parseInt(t, 10))
            }

            let k = 1
            let p = 1
            const sName = symMatch[0]

            const termParts = t.split(sName)
            if (termParts.length > 2) {
                throw new Error("Слагаемое не приведено к каноническому виду (дублирование переменной)")
            }
            if (termParts[1] && !/^(\^\d+)?$/.test(termParts[1])) {
                throw new Error("Обнаружены смешанные переменные или неверный формат степени")
            }

            const coeffStr = termParts[0].replace('*', '')
            if (coeffStr === '-') k = -1
            else if (coeffStr === '+') k = 1
            else if (coeffStr !== '') k = parseInt(coeffStr, 10)

            if (termParts[1]) {
                p = parseInt(termParts[1].replace('^', ''), 10)
            }

            return new Term(k, new MathSymbol(sName), p)
        })

        const r = []

        for (const t of expr) {
            if (t instanceof MathNumber) {
                continue
            }

            const differentiatedTerm = t.diff(targetVar)

            if (differentiatedTerm instanceof MathNumber && differentiatedTerm.value === 0) {
                continue
            }

            if (differentiatedTerm.k !== 0) {
                r.push(differentiatedTerm)
            }
        }

        if (r.length === 0) return '0'

        return r.map((t, i) => {
            let res = ''
            const absK = Math.abs(t.k)

            if (i > 0) {
                res += t.k < 0 ? ' - ' : ' + '
            } else if (t.k < 0) {
                res += '-'
            }

            if (t.p === 0) {
                res += absK
            } else {
                if (absK !== 1) res += absK
                res += t.s.name
                if (t.p > 1) res += `^{${t.p}}`
            }
            return res
        }).join('')
    }
}

export { MiniMaple, Term, MathNumber, MathSymbol }