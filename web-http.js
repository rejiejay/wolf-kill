const http = require('http');
const Path = require("path");
const fs = require("fs");
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const webRender = async() => {
    const jsInstance = await uglifyJavaScript();
    if (jsInstance.result !== 1) return jsInstance;

    const cssInstance = await lessToCss();
    if (cssInstance.result !== 1) return cssInstance;

    const htmlInstance = await htmlHandle();
    if (htmlInstance.result !== 1) return htmlInstance;

    return consequencer.success()
}

const lessToCss = async() => consequencer.success()
const uglifyJavaScript = async() => new Promise(resolve => webpack({
    devtool: 'cheap-module-eval-source-map',
    entry: [
        './index.jsx'
    ],
    output: {
        publicPath: './',
        path: '/Jekerfolder/code/my/wolf/web/build',
        filename: 'index.js'
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': '"development"'
        }),
        new UglifyJsPlugin({
            sourceMap: true,
            extractComments: true
        })
    ]
}, (err, stats) => {
    if (err || stats.hasErrors()) return resolve(consequencer.error(stats.toJson().errors))
    resolve(consequencer.success())
}))
const htmlHandle = async() => {
    const readFile = () => new Promise(resolve => fs.readFile('./index.html', 'utf8', (readFileError, content) => {
        if (readFileError) return resolve(consequencer.error(readFileError.message))
        resolve(consequencer.success(content))
    }))
    const fileHandle = fileString => new Promise(resolve => {
        // const handleConfig = {
        // version : versionHandle
        // }
        resolve(consequencer.success(fileString))
    })
    const writeFile = fileString => new Promise(resolve => fs.writeFile('./build/index.html', fileString, 'utf8', err => {
        if (err) return resolve(consequencer.error(err.message))
        resolve(consequencer.success())
    }))

    const step = [readFile, fileHandle, writeFile]

    const init = async() => {
        const fileString = await step[0]()
        if (fileString.result !== 1) return fileString;

        const targetString = await step[1](fileString.data);
        if (targetString.result !== 1) return targetString;

        const render = await step[2](targetString.data);
        return render
    }

    return await init()
}

const createHttp = () => {
    const server = http.createServer(webHttpHandle)
    server.listen(1337, '127.0.0.1')
}

const init = async() => {
    const step = [webRender, createHttp]

    const renderInstance = await step[0]();
    if (renderInstance.result !== 1) return console.error(`build error ${renderInstance.message}`);

    step[1]();
}

const webHttpHandle = (req, res) => {
    const baseFileHandle = async() => {
        if (req.url === '/' || req.url.indexOf('/index.html') === 0) {
            const htmlInstance = await htmlHandle();
            if (htmlInstance.result !== 1) return htmlInstance;
            readStreamHandle('./build/index.html')
            return consequencer.success()
        }

        if (req.url === '/index.js') {
            const jsInstance = await uglifyJavaScript();
            if (jsInstance.result !== 1) return jsInstance;
            readStreamHandle('./build/index.js')
            return consequencer.success()
        }

        if (req.url === '/index.css') {
            const cssInstance = await lessToCss();
            if (cssInstance.result !== 1) return cssInstance;
            readStreamHandle('./build/index.css')
            return consequencer.success()
        }

        return consequencer.error('can`t intercept lib')
    }

    const staticFileHandle = () => {
        if (req.url.indexOf('/lib/') !== 0) return consequencer.error('can`t intercept lib')
        readStreamHandle(`.${req.url}`)
        return consequencer.success()
    }

    const errorHandle = message => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(message);
    }

    const readStreamHandle = locationPath => {
        const fileName = Path.resolve(__dirname, locationPath)
        const extName = Path.extname(fileName).substr(1);
        if (fs.existsSync(fileName)) {
            const mineTypeMap = { html: 'text/html;charset=utf-8', htm: 'text/html;charset=utf-8', xml: "text/xml;charset=utf-8", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", css: "text/css;charset=utf-8", txt: "text/plain;charset=utf-8", mp3: "audio/mpeg", mp4: "video/mp4", ico: "image/x-icon", tif: "image/tiff", svg: "image/svg+xml", zip: "application/zip", ttf: "font/ttf", woff: "font/woff", woff2: "font/woff2" }
            if (mineTypeMap[extName]) {
                res.writeHead(200, { 'Content-Type': mineTypeMap[extName] });
            }
            fs.createReadStream(fileName).pipe(res)
        }
    };

    const handleConfig = {
        webRender: webRender,
        baseStatic: baseFileHandle,
        static: staticFileHandle,
        error: errorHandle,
        readFileStream: readStreamHandle
    }

    const init = async() => {
        const renderInstance = await handleConfig.webRender();
        if (renderInstance.result !== 1) return errorHandle(`build error ${renderInstance.message}`);

        const baseFileInstance = await handleConfig.baseStatic();
        if (baseFileInstance.result === 1) return true

        const staticFileInstance = await handleConfig.static();
        if (staticFileInstance.result === 1) return true

        errorHandle('404 Not Found');
    }

    init();
}

const consequencer = {
    success: (data, message) => ({ result: 1, data: data || null, message: message || 'success' }),
    error: (message, result, data) => ({ result: result || 0, data: data || null, message: message })
}

init()