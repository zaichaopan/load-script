const {
    normalizeOptions,
    stringifyParams,
    addScript,
    load,
    addFakeAddScript
} = require('../index')

test('it can normalize options', () => {
    ;['src', 'callbackName', 'resolve'].forEach(key => {
        let options = getValidOptions()
        delete options[key]
        let message = key + ' is required!'
        expect(() => normalizeOptions(options)).toThrow(message)
    })

    let options = getValidOptions()
    normalizeOptions(options)
    expect(options.params).toEqual({})

    options.params = { key: 'abc' }
    normalizeOptions(options)
    expect(options.params).toEqual({ key: 'abc' })
})

test('it can stringify params', () => {
    let params = {
        library: 'place',
        key: 'abc'
    }
    let str = stringifyParams(params)
    let expectedStr = 'library=place&key=abc'
    expect(str).toEqual(expectedStr)
})

test('it can add script', () => {
    let src = 'http://www.google.com'
    let str = 'callback=initMap'

    addScript(src, str)
    let scripts = document.scripts;
    let expectedScript = src + "?" + str
    expect(scripts.length).toEqual(1)
    expect(document.scripts[0].script).toEqual(expectedScript)
})

test('it can resolve after add script', () => {
    let options = getValidOptions()
    let googleObj = {}
    addFakeAddScript(fakeAddScriptImplementation(options, googleObj))
    return load(options).then(data => {
        expect(data).toBe(googleObj);
    });

})

test('it will not resolve same lib if it has been resolved', () => {
    let options = getValidOptions()
    addFakeAddScript(fakeAddScriptImplementation(options))
    expect.assertions(1)
    return load(options).then(data => {
        let resolved = data
        return load(options).then(data => {
            expect(data).toBe(resolved)
        })
    })
})

test('it can resolve multiple libs', () => {
    let options = getValidOptions()
    addFakeAddScript(fakeAddScriptImplementation(options))
    expect.assertions(1)
    return load(options).then(data => {
        let resolved = data
        options.src = 'http://www.google.auth.api'
        return load(options).then(data => {
            expect(data).not.toBe(resolved)
        })
    })
})

test('it will throw appropriate error is after timeout ', () => {
    let options = getValidOptions()
    // override default time out(10s)
    options.timeout = 2000
    return load(options)
        .catch(e => {
            expect.assertions(1)
            expect(e).toEqual(new Error('Cannot resolve ' + options.src))
        })
})

function fakeAddScriptImplementation(options, resolve = {}) {
    return (src, str) => {
        setTimeout(() => {
            window[options.resolve] = resolve
            window[src]()
        }, 1000)
    }
}
function getValidOptions() {
    return {
        src: 'https://www.example.com',
        callbackName: 'callback',
        resolve: 'google'
    }
}
