var promiseObj = {};
var defaultTimeout = 10000

function load(options = {}) {
    normalizeOptions(options)
    var identifier = getIdentifier(options.src)
    if (promiseObj[identifier] === undefined) {
        promiseObj[identifier] = new Promise(function (resolve, reject) {
            var timeoutId = setTimeout(function () {
                window[identifier] = function () { }
                reject(new Error('Cannot resolve ' + options.src))
            }, options.timeout || defaultTimeout)

            window[identifier] = function () {
                if (timeoutId !== null) clearTimeout(timeoutId)
                var result = window[options.resolve]
                resolve(result)
                delete window[identifier]
            }

            options.params[options.callbackName] = identifier;
            var str = stringifyParams(options.params)
            exports.addScript(options.src, str)
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
    scriptElement.src = src + '?' + str
    document.body.appendChild(scriptElement)
}

function getIdentifier(src) {
    return src.replace(/(:\/{2})|\.|\//g, '')
}

exports.load = load
exports.stringifyParams = stringifyParams
exports.normalizeOptions = normalizeOptions
exports.addScript = addScript
exports.getIdentifier = getIdentifier
