import React, { Component, createRef } from "react"
import axios from "axios"
import { Image, View, StatusBar, Dimensions, Text, BackHandler } from "react-native"
import WebView from "react-native-webview"
import RNFS from "react-native-fs"
import storage from "./utils/storage"

export default class App extends Component {

    width = Dimensions.get("window").width
    height = Dimensions.get("window").height
    a = this.height / 400
    timer = null
    webview = createRef()
    webviewState = 0

    showMessage = data => {
        if (this.timer) clearTimeout(this.timer)
        this.setState({
            message: data
        })
        this.timer = setTimeout(() => {
            this.setState({
                message: null
            })
        }, 1500)
    }

    listen = async e => {
        const { type, data, withCookie, time } = JSON.parse(e.nativeEvent.data)

        let resData

        switch (type) {

            case "console":
                console.log(...data)
                return

            case "cookie":
                console.log("接收到 cookie")
                console.log(data)
                await storage.save({
                    key: "cookie",
                    data
                })
                this.cookie = data
                // 这里必须先切换为0，再切换为1，直接切换不能重新 render 停留在登录页面，不知道为啥
                this.setState({
                    show: 0
                })
                await this.initApp()
                return

            case "message":
                this.showMessage(data)
                return

            case "changeState":
                this.webviewState = data
                return

            case "isTV":
                await storage.save({
                    key: "isTV",
                    data
                })
                this.isTV = data
                return

            case "login":
                console.log("收到登录请求")
                this.setState({
                    show: 2
                })
                return

            case "axios":
                console.log("接收到 axios 请求")
                if (withCookie) {
                    data.headers = {}
                    data.headers.cookie = this.cookie
                }

                try {
                    resData = (await axios(data)).data
                    this.webview.current.postMessage(JSON.stringify({
                        type,
                        time,
                        data: resData
                    }))
                } catch (error) {
                    this.webview.current.postMessage(JSON.stringify({
                        type,
                        time,
                        data: "Network Error"
                    }))
                }
                return

            default:
                return
        }
    }

    state = {
        show: 0,
        html: "",
        message: null
    }

    backAction = () => {
        if (this.webviewState === 0) return false
        else {
            this.webview.current.postMessage(JSON.stringify({
                type: "back"
            }))
            return true
        }
    }

    async componentDidMount() {

        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.backAction
        )
        await this.initApp()
    }

    initApp = async () => {
        if (!this.react) this.react = await RNFS.readFileAssets("react.production.min.js")
        if (!this.reactdom) this.reactdom = await RNFS.readFileAssets("react-dom.production.min.js")
        if (!this.player) this.player = await RNFS.readFileAssets("xgplayer.js")
        if (!this.hlsjsplayer) this.hlsjsplayer = await RNFS.readFileAssets("HlsJsPlayer.js")
        if (!this.babel) this.babel = await RNFS.readFileAssets("babel.min.js")
        if (!this.main) this.main = await RNFS.readFileAssets("main.js")
        if (!this.cookie) {
            try {
                this.cookie = await storage.load({ key: "cookie" })
            } catch (error) {
                this.cookie = ""
            }
        }
        if (!this.isTV) {
            try {
                this.isTV = await storage.load({ key: "isTV" })
            } catch (error) {
                this.isTV = -1
            }
        }
        this.setState({
            show: 1,
            html: `
            <!DOCTYPE html>
            <html lang="zh">
            
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="initial-scale=0, maximum-scale=0, user-scalable=0">
                <title>AcFun TV</title>
                <script>
                    ${this.react}
                </script>
                <script>
                    ${this.reactdom}
                </script>
                <script>
                    ${this.player}
                </script>
                <script>
                    ${this.hlsjsplayer}
                </script>
                <script>
                    ${this.babel}
                </script>
                <style>
                    html, body, #root, #app {
                        width: 100%;
                        height: 100%;
                    }
                    * {
                        margin: 0;
                        padding: 0;
                    }
                </style>
            </head>
            
            <body>
                <div id="root"></div>
            </body>
            <script type="text/babel">
                const isTV = ${this.isTV}
                const cookie = "${this.cookie}"
                const postMessage = message => window.ReactNativeWebView.postMessage(JSON.stringify(message))
                console.log = (...rest) => postMessage({
                    type: "console",
                    data: rest
                })
                console.warn = console.log
                console.error = console.log
                console.debug = console.log
                console.info = console.log
                try {
                    ${this.main}
                } catch (error) {
                    console.log(error.toString())
                }
                console.log(!!Player)
            </script>
            
            </html>
            `
        })
    }

    render() {

        const { listen, webview, width, height, a } = this

        const { show, html, message } = this.state

        return (
            <>
                <StatusBar hidden={true} />
                {
                    (() => {
                        switch (show) {
                            case 0:

                                return (
                                    <Image source={require("./images/loading.png")} resizeMode="cover" style={{ width, height }} />
                                )

                            case 1:

                                return (
                                    <WebView style={{ flex: 1 }} source={{ html }} onMessage={listen} ref={webview} mediaPlaybackRequiresUserAction={false} />
                                )

                            case 2:

                                return (
                                    <WebView
                                        style={{ flex: 1 }}
                                        source={{ uri: "https://www.acfun.cn/login?returnUrl=https%3A%2F%2Fwww.acfun.cn%2Finfo%2F%23page%3Dabout" }}
                                        onMessage={listen}
                                        userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.20 Safari/537.36"
                                        injectedJavaScript={`
                                            const postMessage = message => window.ReactNativeWebView.postMessage(JSON.stringify(message))
                                            const meta = document.createElement('meta')
                                            meta.setAttribute('content', 'initial-scale=0, maximum-scale=0, user-scalable=0')
                                            meta.setAttribute('name', 'viewport')
                                            document.head.appendChild(meta)
                                            function hideOthers(e) {
                                                if (e === document.body) return
                                                for (let i of e.parentElement.children) {
                                                    if (i.style && i !== e) i.style.display = "none"
                                                }
                                                e.parentElement.style = "margin: 0; padding: 0; background-color: transparent; background-image: none;  border: none; "
                                                hideOthers(e.parentElement)
                                            }
                                            if (location.href === "https://www.acfun.cn/login?returnUrl=https%3A%2F%2Fwww.acfun.cn%2Finfo%2F%23page%3Dabout") {
                                                const style = document.createElement("style")
                                                style.innerHTML = ".status { display: none !important; }"
                                                document.head.appendChild(style)
                                                const code = document.querySelector("#code img")
                                                hideOthers(code)
                                                const bg = document.createElement("div")
                                                bg.style = "position: fixed; width: 100%; height: 100%; background-image: url(https://s3.bmp.ovh/imgs/2022/01/07cee7b5cfdf4ad7.jpg); background-size: cover; background-repeat: no-repeat; background-position: center; z-index: 9990;"
                                                document.body.appendChild(bg)
                                                const cover = document.createElement("div")
                                                cover.style = "position: fixed; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); z-index: 9991;"
                                                document.body.appendChild(cover)
                                                const width = parseFloat(getComputedStyle(bg).width)
                                                const height = parseFloat(getComputedStyle(bg).height)
                                                const o = height / 720
                                                document.querySelector("#main").style.zIndex = "9992"
                                                code.style = \`position: fixed; left: \${160 * o}px; top: \${180 * o}px; width: \${300 * o}px; height: \${300 * o}px\`
                                                const tip = document.createElement("div")
                                                tip.innerHTML = "请使用 AcFun 手机版扫码登录"
                                                tip.style = \`position: fixed; left: \${160 * o}px; top: \${480 * o}px; width: \${300 * o}px; line-height: \${60 * o}px; color: #FD4C5D; font-weight: bold; text-align: center; z-index: 9993; font-size: \${20 * o}px\`
                                                document.body.appendChild(tip)

                                                const account = document.createElement("input")
                                                account.placeholder = "请输入手机号或者邮箱"
                                                account.autofocus = true
                                                account.id = "account"
                                                account.type = "text"
                                                account.style = \`position: fixed; right: \${160 * o}px; top: \${180 * o}px; width: \${500 * o}px; height: \${80 * o}px; font-size: \${40 * o}px; padding-left: \${40 * o}px; background-color: white; z-index: 99999; box-sizing: border-box;\`
                                                document.body.appendChild(account)

                                                const password = document.createElement("input")
                                                password.placeholder = "请输入密码"
                                                password.id = "password"
                                                password.type = "password"
                                                password.style = \`position: fixed; right: \${160 * o}px; top: \${290 * o}px; width: \${500 * o}px; height: \${80 * o}px; font-size: \${40 * o}px; padding-left: \${40 * o}px; background-color: white; z-index: 99999; box-sizing: border-box;\`
                                                document.body.appendChild(password)

                                                const login = document.createElement("button")
                                                login.id = "login"
                                                login.innerHTML = "登录"
                                                login.onclick = () => {
                                                    document.querySelector("#ipt-account-login").value = account.value
                                                    document.querySelector("#ipt-pwd-login").value = password.value
                                                    document.querySelector(".btn-login").click()
                                                }
                                                login.onfocus = () => login.style.backgroundColor = "red"
                                                login.onblur = () => login.style.backgroundColor = "#FD4C5D"
                                                login.style = \`position: fixed; right: \${160 * o}px; top: \${400 * o}px; width: \${500 * o}px; height: \${80 * o}px; line-height: \${80 * o}px; font-size: \${40 * o}px; background-color: #FD4C5D; z-index: 99999; box-sizing: border-box; text-align: center; color: white;\`
                                                document.body.appendChild(login)

                                                const loginTip = document.createElement("div")
                                                loginTip.innerHTML = "或者使用键盘上下方向键来进行登录"
                                                loginTip.style = \`position: fixed; right: \${160 * o}px; top: \${480 * o}px; width: \${500 * o}px; line-height: \${60 * o}px; color: #FD4C5D; font-weight: bold; text-align: center; z-index: 9993; font-size: \${20 * o}px;\`
                                                document.body.appendChild(loginTip)

                                                const targetNode = document.getElementsByClassName("status")[0]
                                                const config = { attributes: true, childList: true, subtree: true }
                                                const callback = function (mutationsList, observer) {
                                                    if (getComputedStyle(targetNode).display !== "none") {
                                                        console.log("点击了按钮")
                                                        document.querySelector(".refresh-btn").click()
                                                    }
                                                }
                                                const observer = new MutationObserver(callback)
                                                observer.observe(targetNode, config)
                                            }
                                            if (location.href === "https://www.acfun.cn/info/#page=about") {
                                                window.ReactNativeWebView.postMessage(JSON.stringify({
                                                    type: "cookie",
                                                    data: document.cookie
                                                }))
                                            }
                                        `}
                                    />
                                )

                            default:
                                return
                        }
                    })()
                }
                <View style={{ position: "absolute", width, height, left: 0, top: 0, justifyContent: "center", alignItems: "center", display: message ? "flex" : "none" }} >
                    <Text style={{ lineHeight: 50 * a, fontSize: 30 * a, backgroundColor: "rgba(0, 0, 0, 0.5)", paddingLeft: 20 * a, paddingRight: 20 * a, borderRadius: 6 * a, color: "white" }}>{message}</Text>
                </View>
            </>
        )
    }
}