var promiseObj = {};
var defaultTimeout = 10000
var fakeAddScript

function load(options = {}) {
    normalizeOptions(options)

    var identifier = options.src

    if (promiseObj[identifier] === undefined) {
        promiseObj[identifier] = new Promise(function (resolve, reject) {
            var timeoutId = setTimeout(function () {
                window[identifier] = function () { }
                reject(new Error('Cannot resolve ' + options.src))
            }, options.timeout || defaultTimeout)

            window[identifier] = function () {
                if (timeoutId !== null) clearTimeout(timeoutId)
                resolve(window[options.resolve])
                delete window[identifier]
            }

            options.params[options.callbackName] = identifier;
            var str = stringifyParams(options.params)

            // use for test
            if (fakeAddScript) {
                fakeAddScript(options.src, str)
                return
            }

            addScript(options.src, str)
        })
    }

    return promiseObj[identifier]
}

function normalizeOptions(options) {
    ;['src', 'callbackName', 'resolve'].forEach(key => {
        if (!~Object.keys(options).indexOf(key)) {
            var message = key + ' is required!';
            throw new Error(message);
        }
    })

    options.params = options.params || {}
}

function stringifyParams(params) {
    return Object.keys(params).map(function (key) {
        return key + '=' + params[key]
    }).join('&')
}

function addScript(src, str) {
    var scriptElement = document.createElement('script')
    scriptElement.script = src + '?' + str
    document.body.appendChild(scriptElement)
}

function addFakeAddScript(fn) {
    fakeAddScript = fn
}

module.exports = {
    load,
    stringifyParams,
    normalizeOptions,
    addScript,
    addFakeAddScript
}
