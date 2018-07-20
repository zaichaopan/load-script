jest.unmock('../index');
const loadScript = require('../index')
const { normalizeOptions, stringifyParams, load } = loadScript

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
    let { addScript } = loadScript
    let src = 'http://www.google.com'
    let str = 'callback=initMap'
    addScript(src, str)
    let scripts = document.scripts
    let expectedScript = src + "?" + str

    expect(scripts.length).toEqual(1)
    expect(document.scripts[0].script).toEqual(expectedScript)
})

test('it can resolve after add script', async () => {
    let options = getValidOptions()
    let resolvedValue = {}
    expect.assertions(1)
    mockAddScript(options, resolvedValue)
    let data = await load(options)
    expect(data).toBe(resolvedValue)
})

test('it can resolve multiple libs', async () => {
    let libOne = 'http://www.lib1.comp/api'
    let options = getValidOptions({ src: libOne })
    let resolvedValue = {}
    mockAddScript(options, resolvedValue)

    expect.assertions(2)

    let data = await load(options)
    expect(data).toBe(resolvedValue)

    let libTwo = 'http://www.lib2.comp/api'
    options = getValidOptions({ src: libTwo })
    let anotherResolvedVal = {}
    mockAddScript(options, anotherResolvedVal)
    data = await load(options)

    expect(data).toBe(anotherResolvedVal)
})

test('it will not resolve same lib if it has been resolved', async () => {
    let src = 'http://www.googlemap/api'
    let options = getValidOptions({ src })
    let resolvedValue = {}
    mockAddScript(options, resolvedValue)

    expect.assertions(2)
    let data = await load(options)
    expect(data).toBe(resolvedValue)
    data = await load(options)
    expect(data).toBe(resolvedValue)
})

test('it will throw appropriate error is after timeout ', () => {
    let options = getValidOptions()
    // override default timeout as 1s
    options.timeout = 1000
    // wait until 2s to resolve
    mockAddScript(options, {}, 2000)
    return load(options)
        .catch(e => {
            expect.assertions(1)
            expect(e).toEqual(new Error('Cannot resolve ' + options.src))
        })
})

function mockAddScript(options, resolvedValue = {}, timeout = 1000) {
    loadScript.addScript = jest.fn((src, str) => {
        setTimeout(() => {
            window[options.resolve] = resolvedValue
            window[src]()
        }, timeout)
    })
}

function getValidOptions(options = {}) {
    let src = options.src || 'https://www.example.com' + randomString()
    return {
        src,
        callbackName: options.callbackName || 'callback',
        resolve: options.resolve || 'google'
    }
}

function randomString() {
    return Math.random().toString(36).substring(2)
}
