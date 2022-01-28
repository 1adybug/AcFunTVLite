const axiosDataStorage = {}

document.addEventListener("message", e => {
    const { type, time, data } = JSON.parse(e.data)
    if (type === "axios") axiosDataStorage[time] = data
})

const axios = (data, withCookie = false) => new Promise((res, rej) => {
    const time = new Date() * 1
    postMessage({
        type: "axios",
        data,
        time,
        withCookie
    })
    const timer = setInterval(() => {
        if (axiosDataStorage[time]) {
            clearInterval(timer)
            const result = axiosDataStorage[time]
            delete axiosDataStorage[time]
            if (result !== "Network Error") res(result)
            else rej(result)
        }
    }, 100)
})

const showMessage = data => postMessage({
    type: "message",
    data
})

const width = parseFloat(getComputedStyle(document.body).width)
const height = parseFloat(getComputedStyle(document.body).height)
const a = height / 337.5
const o = width / 1280
const c = height / 720
const style = document.createElement("style")
style.innerHTML = `
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-size: contain;
    background-repeat: no-repeat;
}

*::-webkit-scrollbar {
    display: none;
}

*:focus {
    outline: none;
}

#tv {
    width: 100%;
    height: 100%;
    background-color: #F2F5F6;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 0;
}

#tv-player {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background-color: black;
}

#live-player {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background-color: black;
}

#tv-player-control {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
}

.tv-top-bar {
    flex: none;
    height: ${80 * o}px;
    background-color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: ${20 * o}px;
}

.video-source {
    padding: 0 ${16 * o}px;
    line-height: ${44 * o}px;
    background-color: #EFEFEF;
    border-radius: ${22 * o}px;
    margin-left: ${13 * o}px;
}

.video-source:focus {
    box-shadow: 0 0 ${4 * o}px ${4 * o}px rgba(0, 0, 0, 0.2)
}

.video-source:first-child {
    margin-left: 0px;
}

.video-album-area {
    flex: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    overflow: auto;
    position: relative;
    padding-top: ${39 * o}px;
}

.video-album-ac {
    flex: auto;
    display: flex;
    position: relative;
}

.input-wrapper {
    display: flex;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: ${100 * o}px;
}

.input-video-id, .goto-video-id {
    padding: 0 ${24 * o}px;
    line-height: ${66 * o}px;
    font-size: ${30 * o}px;
}

.input-video-id {
    width: ${600 * o}px;
    border: none;
}

.input-video-id:focus {
    border: ${o}px solid #111111;
}

.goto-video-id {
    width: ${120 * o}px;
    text-align: center;
    background-color: #EFEFEF;
}

.goto-video-id:focus {
    background-color: #FD4C5D;
    color: white;
}

.live-history-wrapper {
    position: absolute;
    width: 100%;
    height: ${500 * o}px;
    padding: ${13 * o}px ${150 * o}px  ${50 * o}px  ${150 * o}px;
    bottom: 0;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    over-flow: hidden;
}

.live-history-wrapper>div {
    font-size: ${20 * o}px;
    padding: 0 ${16 * o}px;
    line-height: ${44 * o}px;
    background-color: #EFEFEF;
    border-radius: ${22 * o}px;
    margin-right: ${13 * o}px;
    margin-bottom: ${13 * o}px;
    flex: none;
}

.live-history-wrapper>div:focus {
    background-color: #FD4C5D;
    color: white;
}

.video-album-wrapper {
    width: ${255 * o}px;
    height: ${222 * o}px;
    flex: none;
    margin: 0 0 ${39 * o}px ${52 * o}px;
    position: relative;
}

.video-album-box {
    width: ${255 * o}px;
    height: ${222 * o}px;
    position: absolute;
    display: flex;
    flex-direction: column;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    background-color: white;
    border-radius: ${6 * o}px;
    overflow: hidden;
}

.video-album-box:focus {
    width: ${306 * o}px;
    height: ${266.4 * o}px;
    box-shadow: 0 0 ${6 * o}px ${6 * o}px rgba(0, 0, 0, 0.2)
}

.video-album-cover {
    width: ${255 * o}px;
    height: ${160 * o}px;
}

.video-album-box:focus .video-album-cover {
    width: ${306 * o}px;
    height: ${192 * o}px;
}

.video-album-info {
    width: ${255 * o}px;
    height: ${62 * o}px;
    position: relative;
}

.video-album-box:focus .video-album-info {
    width: ${306 * o}px;
    height: ${74.4 * o}px;
    position: relative;
}

.video-album-avatar {
    width: ${40 * o}px;
    height: ${40 * o}px;
    border-radius: 50%;
    background-color: cornflowerblue;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: ${8 * o}px;
}

.video-album-box:focus .video-album-avatar {
    width: ${48 * o}px;
    height: ${48 * o}px;
    left: ${9.6 * o}px;
}

.video-album-title {
    width: ${255 * o}px;
    height: ${32 * o}px;
    padding-left: ${56 * o}px;
    padding-right: ${8 * o}px;
    font-size: ${14 * o}px;
    position: absolute;
    line-height: ${40 * o}px;
    overflow: hidden;
    word-break: break-all;
    word-wrap: normal;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: bold;
}

.video-album-box:focus .video-album-title {
    width: ${306 * o}px;
    height: ${48 * o}px;
    padding-left: ${67.2 * o}px;
    padding-right: ${9.6 * o}px;
    font-size: ${16.8 * o}px;
    line-height: ${48 * o}px;
}

.video-album-name {
    flex: auto;
    overflow: hidden;
    word-break: break-all;
    word-wrap: normal;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.video-album-banna {
    flex: none;
    display: flex;
    height: ${32 * o}px;
    align-items: center;
    margin-left: ${4 * o}px;
}

.video-album-box:focus .video-album-banna {
    height: ${38.4 * o}px;
    margin-left: ${4.8 * o}px;
}

.video-album-bottom {
    width: ${255 * o}px;
    height: ${32 * o}px;
    bottom: 0;
    padding-left: ${56 * o}px;
    padding-right: ${8 * o}px;
    font-size: ${14 * o}px;
    position: absolute;
    display: flex;
    line-height: ${32 * o}px;
    color: #999999;
}

.video-album-box:focus .video-album-bottom {
    width: ${306 * o}px;
    height: ${38.4 * o}px;
    bottom: 0;
    padding-left: ${67.2 * o}px;
    padding-right: ${9.6 * o}px;
    font-size: ${16.8 * o}px;
    line-height: ${38.4 * o}px;
}

.video-album-banna-image {
    width: ${16 * o}px;
    height: ${16 * o}px;
    background-image: url(https://ali-imgs.acfun.cn/kos/nlav10360/static/common/static/img/icon_banana.55f04d8b3dc06bce4899.png);
}

.video-album-box:focus .video-album-banna-image {
    width: ${19.2 * o}px;
    height: ${19.2 * o}px;
}

.video-album-banna-num {
    margin-left: ${4 * o}px;
}

.video-album-box:focus .video-album-banna-num {
    margin-left: ${4.8 * o}px;
}

                
.tv-control-video-title {
    font-size: ${32 * o}px;
    font-weight: bold;
    color: white;
    line-height: ${91 * o}px;
    padding-left: ${34 * o}px;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
}

                
.tv-control-video-setting {
    width: 100%;
    position: absolute;
    bottom: 0;
    background-image: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
}

.tv-control-setting-item {
    padding-left: ${56 * o}px;
    position: relative;
    margin-bottom: ${16 * o}px;
}

.tv-control-square {
    position: absolute;
    left: -${25 * o}px;
    top: 50%;
    transform: translateY(-50%);
}

.tv-control-left-point {
    width: ${16 * o}px;
    height: ${16 * o}px;
    border-radius: 50%;
    background-color: white;
}

.tv-control-left-line {
    width: ${4 * o}px;
    height: 100%;
    background-color: burlywood;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    background-color: white;
}
                
.tv-control-setting-name {
    position: relative;
    font-size: ${30 * o}px;
    color: white;
}

.tv-control-item-list {
    margin-top: ${6 * o}px;
    margin-left: ${4 * o}px;
    display: flex;
}


.tv-control-little-name {
    font-size: ${20 * o}px;
    color: white;
}

.tv-control-little-list {
    display: flex;
    margin-top: ${6 * o}px;
}

.tv-control-little-item {
    margin-right: ${16 * o}px;
}

.tv-control-item-choice {
    width: ${106 * o}px;
    height: ${66 * o}px;
    line-height: ${66 * o}px;
    text-align: center;
    font-size: ${22 * o}px;
    background-color: #2A2E3B;
    color: white;
    border-radius: ${4 * o}px;
    margin-right: ${4 * o}px;
}

.tv-control-item-choice.tv-control-selected {
    color: orange;
}

.tv-control-item-choice:focus {
    background-color: #1D1B22;
}

.control-button-wrapper {
    position: fixed;
    right: 0;
    bottom: 0;
    width: 9px;
    height: 9px;
    z-index: 9999999999999999;
    background-color: transparent;
}

.control-button {
    width: 3px;
    height: 3px;
    box-sizing: border-box;
    outline: none;
    border: none;
    position: absolute;
    display: block;
    background-color: transparent;
    color: transparent;
}

.control-button:focus {
    outline: none;
    border: none;
    background-color: transparent;
}

#up-button {
    left: 3px;
    top: 0;
}

#down-button {
    left: 3px;
    bottom: 0;
}

#left-button {
    top: 3px;
    left: 0;
}

#right-button {
    top: 3px;
    right: 0;
}

#confirm-button {
    left: 3px;
    top: 3px;
}

.type-wrapper {
    width: 100%;
    height: 100%;
    background-color: #F5F5F7;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    position: absolute;
    font-size: ${30 * c}px;
    letter-spacing: ${2 * c}px;
}

.choice-title {
    position: absolute;
    width: 100%;
    text-align: center;
    top: ${100 * c}px;
    font-weight: bold;
    color: #424245;
}

.type-choice {

}

.type-img {
    width: ${400 * c}px;
    height: ${320 * c}px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin: ${40 * c}px 0;
    border-radius: ${8 * c}px;
    box-sizing: border-box;
    outline: none;
    border: none;
    background-color: transparent;
}

.type-img:focus {
    outline: none;
    border: none;
    background-color: transparent;
    box-shadow: 0 0 ${4 * o}px ${4 * o}px rgba(0, 0, 0, 0.2);
}

.type-text {
    text-align: center;
    font-weight: bold;
}

.xgplayer-skin-default .xgplayer-controls {
    height: ${40 * a}px !important;
}

.xgplayer-play, .xgplayer-volume, .xgplayer-time, .danmu-switch, .xgplayer-playbackrate, .xgplayer-definition {
    zoom: ${a};
}

.xgplayer-playbackrate, .xgplayer-definition, .danmu-switch {
    margin-left: ${8 * a}px;
    
}

.xgplayer-skin-default .xgplayer-playbackrate ul li {
    font-size: ${12 * a}px !important;
    line-height: ${18 * a}px !important;
}

.xgplayer-skin-default .xgplayer-definition ul li {
    font-size: ${12 * a}px !important;
    line-height: ${18 * a}px !important;
}
`
document.head.appendChild(style)

const { Component, createRef, Fragment, PureComponent } = React
const root = ReactDOM.createRoot(document.getElementById("root"))
class VideoAlbum extends PureComponent {
    render() {
        const { title, up, cover, avatar, bananaCount, ac, playVideo, locateAlbum } = this.props
        return (
            <div className="video-album-wrapper">
                <div className="video-album-box" onClick={() => playVideo(ac)} onFocus={locateAlbum} >
                    <div className="video-album-cover" style={{ backgroundImage: `url(${cover})` }}></div>
                    <div className="video-album-info">
                        <div className="video-album-avatar" style={{ backgroundImage: `url(${avatar})` }}></div>
                        <div className="video-album-title">{title}</div>
                        <div className="video-album-bottom">
                            <div className="video-album-name">{up}</div>
                            <div className="video-album-banna">
                                <div className="video-album-banna-image"></div>
                                <div className="video-album-banna-num">{bananaCount}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

async function getRankList(id) {
    try {
        const day = await axios({
            url: `https://www.acfun.cn/rest/pc-direct/rank/channel?channelId=${id}&subChannelId=&rankLimit=30&rankPeriod=DAY`
        })
        const three = await axios({
            url: `https://www.acfun.cn/rest/pc-direct/rank/channel?channelId=${id}&subChannelId=&rankLimit=30&rankPeriod=THREE_DAYS`
        })
        const week = await axios({
            url: `https://www.acfun.cn/rest/pc-direct/rank/channel?channelId=${id}&subChannelId=&rankLimit=30&rankPeriod=WEEK`
        })
        const originalRankList = [...day.rankList.sort((a, b) => b.bananaCount - a.bananaCount), ...three.rankList.sort((a, b) => b.bananaCount - a.bananaCount), ...week.rankList.sort((a, b) => b.bananaCount - a.bananaCount)]
        const rankList = []
        for (let i of originalRankList) {
            if (rankList.findIndex(value => value.ac === i.contentId) === -1) rankList.push({
                title: i.contentTitle,
                ac: i.contentId,
                up: i.userName,
                cover: i.coverUrl,
                avatar: i.userImg,
                bananaCount: i.bananaCount
            })
        }
        return rankList
    } catch (error) {
        return
    }
}

function getAll(start, end, str, startBool = false, endBool = false) {
    const array = []
    for (; ;) {
        const b = str.indexOf(end)
        if (b === -1) return array
        let _str = str.slice(0, b)
        const a = _str.lastIndexOf(start)
        if (a === -1) {
            str = str.slice(b + end.length)
            continue
        }
        array.push(str.slice(a + (startBool ? 0 : start.length), b + (endBool ? end.length : 0)))
        str = str.slice(b + end.length)
    }
}

async function getVideoInfo(ac) {
    try {
        const data = await axios({
            url: `https://www.acfun.cn/v/ac${ac}`
        })
        const start = data.indexOf(`{"currentVideoId"`)
        const end = data.indexOf("window.videoResource")
        const videoInfo = JSON.parse(data.slice(start, end - 10))
        const videoList = JSON.parse(videoInfo.currentVideoInfo.ksPlayJson)
        const qualityList = []
        for (let i of videoList.adaptationSet[0].representation) {
            const a = i.url
            const b = i.backupUrl[0]
            const url = a.includes("ali-safety") ? a : b
            const start = url.indexOf("hls_")
            const end = url.indexOf(".m3u8")
            const str = url.slice(start + 4, end)
            let name = str.slice(0, str.indexOf("_"))
            if (str.includes("4k")) name = "2160P"
            if (str.includes("h264") && !str.includes("4k")) name += "+"
            name = name.toUpperCase()
            qualityList.push({ name, url })
        }
        let title
        {
            const start = data.indexOf("<title >")
            const str = data.slice(start + 8)
            const end = str.indexOf("- AcFun弹幕视频网")
            title = str.slice(0, end).trim()
        }
        let danmuList = []
        {
            const start = data.indexOf(`"currentVideoId":`)
            const end = data.indexOf(`,"pctr"`)
            const id = data.slice(start + 17, end)
            for (let i = 0; ; i++) {
                const start = i * 30000
                const end = start + 30000
                const data = await axios({
                    url: `https://www.acfun.cn/rest/pc-direct/new-danmaku/pollByPosition?resourceId=${id}&enableAdvanced=true&positionFromInclude=${start}&positionToExclude=${end}`,
                    method: "POST"
                })
                if (data.addCount !== 0) danmuList = [...danmuList, ...data.danmakus]
                else break
            }
            danmuList = danmuList.map(value => ({
                id: value.danmakuId,
                start: value.position,
                txt: value.body,
                duration: 8000,
                style: {
                    color: `#${value.color.toString(16).toUpperCase()}`,
                    fontSize: `${value.size}px`,
                    fontWeight: "bold",
                    textShadow: "0px 0px 2px black"
                },
            }))
        }

        let innerList

        if (data.includes("<h3>分段列表</h3>")) {
            const start = data.indexOf("<h3>分段列表</h3>")
            const str = data.slice(start)
            const end = str.indexOf("</ul>")
            const main = str.slice(0, end)
            let nameList = getAll("'>", "</li>", main).map(value => value.trim())
            let acList = getAll("/v/ac", "' title", main).map(value => value.trim())
            innerList = nameList.map((value, index) => ({ name: value, ac: acList[index] }))
        }
        return ({ title, danmuList, qualityList, innerList })
    } catch (error) {
        return error
    }
}

class App extends Component {

    sourceNameList = [{ name: "综合", id: "" }, { name: "番剧", id: 155 }, { name: "动画", id: 1 }, { name: "娱乐", id: 60 }, { name: "生活", id: 201 }, { name: "音乐", id: 58 }, { name: "舞蹈", id: 123 }, { name: "游戏", id: 59 }, { name: "科技", id: 70 }, { name: "影视", id: 68 }, { name: "体育", id: 69 }, { name: "鱼塘", id: 125 }]

    // 用于避免同一栏目同时更新
    updateing = this.sourceNameList.map(() => false)

    // 用于避免用户在点击某一个栏目，等待更新到这个栏目时，却还没完成更新时，点击了另一个栏目
    waittingIndex = -1

    // 用于存储当前正在请求的视频 ac 号，用于避免同时创建两个视频
    gettingVideo = null

    // 视频播放器对象
    player = null

    // 视频是否暂停
    paused = false

    // 视频清晰度地址列表
    qualityUrlList = []

    // 视频倍速列表
    speedlist = [0.5, 0.75, 1.25, 1, 1.5, 2]

    // 是否已经按下了
    once = true

    // cookie
    cookie = cookie

    // pcursor
    pcursor = 0

    // 用于保存关注视频列表容器
    followRef = createRef()

    // 用于防止同时更新关注页面
    updateingFollowVideo = false

    // 输入框
    inputRef = createRef()

    state = {
        currentSourceIndex: 0,
        show: 0,
        isTV: isTV,
        sourceVideoList: this.sourceNameList.map(() => []),
        title: "",
        controlList: [
            {
                name: "清晰度设置",
                list: ["空地址"],
                selected: 0
            },
            {
                name: "倍速设置",
                list: [0.5, 0.75, 1.25, 1, 1.5, 2],
                selected: 3
            },
            {
                name: "弹幕开关",
                list: ["打开", "关闭"],
                selected: 0
            }
        ],
        followVideoList: [],
        liveHistory: liveHistory
    }


    switchVideoSrc = index => {

        const { currentTime, currentSrc } = this.player
        if (currentSrc === this.qualityUrlList[index]) return
        showMessage(`清晰度切换到了${this.state.controlList[0].list[index]}`)
        this.player.src = this.qualityUrlList[index]
        const timer = setInterval(() => {
            if (this.player.currentSrc !== currentSrc) {
                clearInterval(timer)
                setTimeout(() => {
                    this.player.currentTime = currentTime
                }, 1500)
            }
        }, 100)
        const _ = [...this.state.controlList]
        _[0].selected = index
        this.setState({
            controlList: _
        })
    }

    switchVideoSpeed = index => {
        if (this.player.playbackRate === this.speedlist[index]) return
        showMessage(`倍速切换到了${this.speedlist[index]}`)
        this.player.playbackRate = this.speedlist[index]
        const _ = [...this.state.controlList]
        _[1].selected = index
        this.setState({
            controlList: _
        })
    }

    switchDanmu = index => {
        if (this.player.bullet === (index === 0)) return
        showMessage(`弹幕${this.state.controlList[2].list[index]}`)
        document.querySelector(".danmu-switch").click()
        const _ = [...this.state.controlList]
        _[2].selected = index
        this.setState({
            controlList: _
        })
    }

    controlFun = [this.switchVideoSrc, this.switchVideoSpeed, this.switchDanmu]

    async componentDidMount() {
        document.addEventListener("message", e => {
            const { type } = JSON.parse(e.data)
            if (type === "back") {
                switch (this.state.show) {
                    case 2:
                        this.setState({
                            show: 1
                        })
                        document.getElementById("confirm-button").focus()
                        break

                    case 1:
                        if (this.player && this.player.destroy) this.player.destroy()
                        postMessage({
                            type: "changeState",
                            data: 0
                        })
                        this.setState({
                            show: 0
                        })
                        break

                    case 3:
                        if (this.player && this.player.destroy) this.player.destroy()
                        postMessage({
                            type: "changeState",
                            data: 0
                        })
                        this.setState({
                            show: 0
                        })
                        break

                    default:
                        break
                }
            }
        })
        if (this.state.isTV !== -1) await this.switchToIndex(0)
        else document.addEventListener("keyup", () => {
            if (!this.once) return
            this.once = false
            this.switchDevice(1)
        }, { once: true })
    }

    playVideo = async ac => {

        // 如果需要请求的 ac 号和正在请求的 ac 相同，则返回
        if (this.gettingVideo === ac) return

        showMessage("视频加载中...")
        const timer = setTimeout(() => {
            showMessage("弹幕较多的视频需要加载的时间较长")
        }, 1500)

        // 记录下正则请求的 ac 号
        this.gettingVideo = ac

        // 初始化视频参数
        this.paused = false

        // 获取视频信息
        const videoInfo = await getVideoInfo(ac)

        // 如果此时还没有 1500ms 则清除
        clearTimeout(timer)

        // 如果此时返回的视频信息为空，或者希望请求的 ac 号又变了（只要改变了请求的 ac 号，无论是新的 ac 号，或者是 null），则啥也不做
        if (!videoInfo || this.gettingVideo !== ac) {
            // 清除
            this.gettingVideo = null
            return
        }

        // 如果此时播放器对象还存在，尝试销毁
        if (this.player) {
            try {
                this.player.destroy()
            } catch (error) {
                console.log(error)
            }
        }

        // 存储视频清晰度地址
        this.qualityUrlList = videoInfo.qualityList.map(value => value.url)

        // 修改控制参数列表
        const _ = [...this.state.controlList]
        _[0].list = videoInfo.qualityList.map(value => value.name)

        // 告诉外层的 React Native 此时不可以直接返回
        postMessage({
            type: "changeState",
            data: 1
        })

        // 准备播放
        this.setState({
            title: videoInfo.title,
            show: 1,
            controlList: _
        })

        // 初始化播放器
        this.player = new HlsJsPlayer({
            id: "tv-player",
            url: videoInfo.qualityList[0].url,
            playsinline: true,
            width,
            height,
            playbackRate: [0.5, 0.75, 1.25, 1, 1.5, 2],
            autoplay: true,
            enableVideoDbltouch: true,
            keyShortcut: "off",
            danmu: { comments: videoInfo.danmuList },
            ignores: this.state.isTV === 0 ? ["fullscreen"] : [],
            controls: this.state.isTV === 0,
            playbackRateUnit: "X"
        })

        this.player.emit("resourceReady", videoInfo.qualityList)

        // 播放后聚焦按钮
        this.player.once("play", () => {
            this.gettingVideo = false
            document.getElementById("confirm-button").focus()
        })

        // 清除 ac 号
        this.gettingVideo = null
    }

    playLiveVideo = async ac => {

        console.log("被执行了")

        // 如果需要请求的 ac 号和正在请求的 ac 相同，则返回
        if (this.gettingVideo === ac) return

        showMessage("直播加载中...")

        // 记录下正则请求的 ac 号
        this.gettingVideo = ac

        // 获取视频信息
        const r0 = await axios({
            url: "https://id.app.acfun.cn/rest/app/visitor/login",
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "zh-CN,zh;q=0.9",
                "cache-control": "no-cache",
                "content-length": 21,
                "content-type": "application/x-www-form-urlencoded",
                "origin": "https://live.acfun.cn",
                "pragma": "no-cache",
                "referer": "https://live.acfun.cn/",
                "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": `"Windows"`,
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.9 Safari/537.36",
                "cookie": "_did=web_3294464753C20698"
            },
            withCredentials: true,
            method: "post",
            data: "sid=acfun.api.visitor"
        })

        const r1 = await axios({
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "zh-CN,zh;q=0.9",
                "cache-control": "no-cache",
                "content-length": 21,
                "content-type": "application/x-www-form-urlencoded",
                "origin": "https://live.acfun.cn",
                "pragma": "no-cache",
                "referer": "https://live.acfun.cn/",
                "sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": `"Windows"`,
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.9 Safari/537.36",
                "cookie": "_did=web_3294464753C20698"
            },
            url: `https://api.kuaishouzt.com/rest/zt/live/web/startPlay?subBiz=mainApp&kpn=ACFUN_APP&kpf=PC_WEB&userId=${r0.userId}&acfun.api.visitor_st=${r0["acfun.api.visitor_st"]}`,
            withCredentials: true,
            method: "post",
            data: `authorId=${ac}&pullStreamType=FLV`
        })

        if (r1.result !== 1) {
            showMessage("直播间不存在或者未开播")
            return
        }

        const r2 = await axios({ url: `https://live.acfun.cn/live/${ac}` })

        const up = getAll(`class="up-name">`, `</a>`, r2)[0]

        if (this.state.liveHistory.findIndex(value => value.ac === ac) === -1) {
            this.setState({
                liveHistory: [{ ac, up }, ...this.state.liveHistory]
            })
            postMessage({
                type: "liveHistory",
                data: { ac, up }
            })
        }

        const videoList = getAll(`"url":"`, `","bitrate"`, r1.data.videoPlayRes)

        console.log(videoList)

        // 如果此时播放器对象还存在，尝试销毁
        if (this.player) {
            try {
                this.player.destroy()
            } catch (error) {
                console.log(error)
            }
        }

        // 告诉外层的 React Native 此时不可以直接返回
        postMessage({
            type: "changeState",
            data: 1
        })

        this.setState({
            show: 3
        })

        // 初始化播放器
        this.player = new FlvJsPlayer({
            id: "live-player",
            url: videoList[videoList.length - 1],
            playsinline: true,
            width,
            height,
            autoplay: true,
            enableVideoDbltouch: true,
            keyShortcut: "off",
            ignores: this.state.isTV === 0 ? ["fullscreen"] : [],
            controls: this.state.isTV === 0
        })

        this.gettingVideo = null

        console.log("直播到此")
    }


    playInputVideo = () => {
        const ac = this.inputRef.current.value * 1
        this.playVideo(ac)
    }

    playInputLiveVideo = () => {
        const ac = this.inputRef.current.value * 1
        this.playLiveVideo(ac)
    }

    // 防止某个视频专辑封面不能在屏幕中完整显示
    locateAlbum = index => {

        // 获取视频容器包含上边距的位置
        const albumTop = Math.floor(index / 4) * 261 * o

        // 获取视频容器包含下边距的位置
        const albumBottom = (Math.floor(index / 4) + 1) * 261 * o + 39 * o

        const currentArea = this.state.currentSourceIndex > -1 ? document.querySelectorAll(".video-album-area")[this.state.currentSourceIndex] : document.getElementById("video-album-follow")

        const scrollTop = currentArea.scrollTop

        const scrollBottom = scrollTop + height - 80 * o

        if (albumTop < scrollTop) currentArea.scrollTop = albumTop
        if (scrollBottom > albumBottom) currentArea.scrollTop = albumBottom - (height - 80 * o)

        if (this.state.currentSourceIndex === -1 && index + 5 > this.state.followVideoList.length) this.updateFollowVideo()

    }

    switchToIndex = async index => {

        if (index === -2) {
            this.setState({
                currentSourceIndex: index
            })
            // await this.playLiveVideo(40656720)
            return
        }

        if (index === -1) {
            console.log(this.cookie)
            if (!this.cookie) {
                postMessage({
                    type: "login"
                })
                return
            }
            this.pcursor = 0
            this.updateFollowVideo()
            return
        }

        showMessage("页面加载中...")
        if (this.updateing[index]) return
        this.updateing[index] = true
        this.waittingIndex = index
        const res = await getRankList(this.sourceNameList[index].id)
        if (!res) {
            this.updateing[index] = false
            return
        }
        const _ = [...this.state.sourceVideoList]
        _[index] = res
        if (this.waittingIndex === index) {
            this.setState({
                currentSourceIndex: index,
                sourceVideoList: _
            })
        } else {
            this.state.sourceVideoList[index] = res
        }
        this.updateing[index] = false
    }

    updateFollowVideo = async () => {
        showMessage("页面加载中...")

        if (this.updateingFollowVideo) return
        this.updateingFollowVideo = true
        const timer = setTimeout(() => {
            this.updateingFollowVideo = false
        }, 2000)
        if (isNaN(this.pcursor * 1)) return
        const data = await axios({ url: `https://www.acfun.cn/rest/pc-direct/feed/followDougaFeed?pcursor=${this.pcursor}&count=20` }, true)
        this.pcursor = data.pcursor
        const _data = await axios({ url: `https://www.acfun.cn/rest/pc-direct/feed/followDougaFeed?pcursor=${this.pcursor}&count=20` }, true)
        this.pcursor = _data.pcursor
        const feedList = [...data.feedList, ..._data.feedList]
        if (this.pcursor !== 0) {
            const _ = this.state.followVideoList
            this.setState({
                currentSourceIndex: -1,
                followVideoList: [..._, ...feedList.map(value => ({
                    title: value.detail.title,
                    up: value.user.userName,
                    cover: value.coverUrl,
                    avatar: value.user.userHead,
                    bananaCount: value.bananaCount,
                    ac: value.resourceId
                }))]
            })
        } else {
            this.setState({
                currentSourceIndex: -1,
                followVideoList: feedList.map(value => ({
                    title: value.detail.title,
                    up: value.user.userName,
                    cover: value.coverUrl,
                    avatar: value.user.userHead,
                    bananaCount: value.bananaCount,
                    ac: value.resourceId
                }))
            })
        }
        this.pcursor = pcursor
        clearTimeout(timer)
        this.updateingFollowVideo = false
    }

    pauseVideo = () => {
        if (this.paused) this.player.pause()
        else this.player.play()
        this.paused = !this.paused
    }

    showControl = () => {
        document.getElementById("confirm-button").focus()
        this.setState({
            show: 2
        })
    }

    showTimeFormat = second => {
        const hour = Math.floor(second / 3600)
        const hourStr = hour === 0 ? "" : `${hour < 10 ? 0 : ""}${hour} : `
        const min = Math.floor((second - hour * 3600) / 60)
        const minStr = `${min < 10 ? 0 : ""}${min} : `
        const sec = Math.floor(second - hour * 3600 - min * 60)
        const secStr = `${sec < 10 ? 0 : ""}${sec}`
        return `${hourStr}${minStr}${secStr}`
    }

    forwardVideo = () => {
        document.getElementById("confirm-button").focus()
        const { currentTime, duration } = this.player
        const _currentTime = currentTime + 10 < duration ? currentTime + 10 : duration
        this.player.currentTime = _currentTime
        showMessage(`快进：${this.showTimeFormat(_currentTime)} / ${this.showTimeFormat(duration)}`)
    }

    backwardVideo = () => {
        document.getElementById("confirm-button").focus()
        const { currentTime, duration } = this.player
        const _currentTime = currentTime - 10 > 0 ? currentTime - 10 : 0
        this.player.currentTime = _currentTime
        showMessage(`快退：${this.showTimeFormat(_currentTime)} / ${this.showTimeFormat(duration)}`)
    }

    switchDevice = async num => {
        this.setState({
            isTV: num
        })
        await this.switchToIndex(0)
        postMessage({
            type: "isTV",
            data: num
        })
    }

    // 关注页面滚动到底时，将会更新视频列表
    scrollToUpdateFollow = () => {
        if (this.followRef.current.scrollHeight < (this.followRef.current.scrollTop + height - 80 * o + 261 * o)) this.updateFollowVideo()
    }

    render() {

        const { sourceNameList, switchToIndex, playVideo, pauseVideo, showControl, forwardVideo, backwardVideo, controlFun, locateAlbum, switchDevice, followRef, scrollToUpdateFollow, playLiveVideo, inputRef, playInputVideo, playInputLiveVideo } = this

        const { currentSourceIndex, show, sourceVideoList, title, controlList, isTV, followVideoList, liveHistory } = this.state

        return (
            <Fragment>

                {isTV !== -1 ?

                    <div id="tv">
                        <div className="tv-top-bar" style={{ display: show === 0 ? "flex" : "none" }}>
                            <div className="video-source" style={{ backgroundColor: currentSourceIndex === -2 ? "#FD4C5D" : "#EFEFEF", color: currentSourceIndex === -2 ? "white" : "black" }} onClick={() => switchToIndex(-2)} >直播</div>
                            <div className="video-source" style={{ backgroundColor: currentSourceIndex === -1 ? "#FD4C5D" : "#EFEFEF", color: currentSourceIndex === -1 ? "white" : "black" }} onClick={() => switchToIndex(-1)} >关注</div>
                            {
                                sourceNameList.map((value, index) => <div className="video-source" style={{ backgroundColor: currentSourceIndex === index ? "#FD4C5D" : "#EFEFEF", color: currentSourceIndex === index ? "white" : "black" }} onClick={() => switchToIndex(index)} >{value.name}</div>)
                            }
                        </div>
                        {
                            sourceVideoList.map((value, index) =>
                                <div className="video-album-area" style={{ display: show === 0 && index === currentSourceIndex ? "flex" : "none" }} key={index} >
                                    {
                                        value.map((_value, _index) => <VideoAlbum title={_value.title} up={_value.up} cover={_value.cover} avatar={_value.avatar} bananaCount={_value.bananaCount} ac={_value.ac} key={_value.ac} playVideo={playVideo} locateAlbum={() => locateAlbum(_index)} />)
                                    }
                                </div>
                            )
                        }
                        <div className="video-album-area" id="video-album-follow" style={{ display: show === 0 && currentSourceIndex === -1 ? "flex" : "none" }} key={-1} ref={followRef} onScroll={scrollToUpdateFollow} >
                            {
                                followVideoList.map((_value, _index) => <VideoAlbum title={_value.title} up={_value.up} cover={_value.cover} avatar={_value.avatar} bananaCount={_value.bananaCount} ac={_value.ac} key={_value.ac} playVideo={playVideo} locateAlbum={() => locateAlbum(_index)} />)
                            }
                        </div>
                        <div className="video-album-ac" style={{ display: show === 0 && currentSourceIndex === -2 ? "flex" : "none" }}>
                            <div className="input-wrapper">
                                <input type="number" className="input-video-id" placeholder="请输入直播房间号或者视频AC号(纯数字)" ref={inputRef} /><div className="goto-video-id" onClick={playInputLiveVideo}>直播</div><div className="goto-video-id" onClick={playInputVideo}>视频</div>
                            </div>
                            <div className="live-history-wrapper">
                                {
                                    liveHistory.map(value => <div onClick={() => playLiveVideo(value.ac)} >{value.up}</div>)
                                }
                            </div>
                        </div>
                        <div id="tv-player" style={{ display: show === 1 || show === 2 ? "block" : "none" }}></div>
                        <div id="live-player" style={{ display: show === 3 ? "block" : "none" }}></div>
                        {/* 用于隐藏西瓜播放器下方一像素高的白线 */}
                        <div style={{ display: show === 1 || show === 2 || show === 3 ? "block" : "none", position: "fixed", width: "100%", height: "1pt", backgroundColor: "black" }}></div>

                        {
                            isTV === 1 ? <div className="control-button-wrapper" style={{ display: show === 1 ? "block" : "none" }}>
                                <button className="control-button" id="up-button" onClick={() => { }} onFocus={showControl}></button>
                                <button className="control-button" id="down-button" onClick={() => { }} onFocus={showControl}></button>
                                <button className="control-button" id="left-button" onClick={() => { }} onFocus={backwardVideo}></button>
                                <button className="control-button" id="right-button" onClick={() => { }} onFocus={forwardVideo}></button>
                                <button className="control-button" id="confirm-button" onClick={pauseVideo}></button>
                            </div> : null
                        }


                        <div id="tv-player-control" style={{ display: show === 2 ? "block" : "none" }}>
                            <div className="tv-control-video-title">{title}</div>
                            <div className="tv-control-video-setting">
                                {
                                    controlList.map((value, index) =>
                                        <div className="tv-control-setting-item">
                                            <div className="tv-control-setting-name">
                                                <div className="tv-control-square">
                                                    <div className="tv-control-left-point"></div>
                                                </div>
                                                <span>{value.name}</span>
                                            </div>
                                            <div className="tv-control-item-list">
                                                <div className="tv-control-little-item">
                                                    <div className="tv-control-little-list">
                                                        {
                                                            value.list.map((_value, _index) => <div className={`tv-control-item-choice ${_index === value.selected ? "tv-control-selected" : ""}`} onClick={() => controlFun[index](_index)} >{_value}</div>)
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    :
                    <div className="type-wrapper">
                        <div className="choice-title">请选择你的设备类型，电视设备按下任意按键</div>
                        <div className="type-choice" >
                            <button className="type-img" style={{ backgroundImage: "url(https://s3.bmp.ovh/imgs/2022/01/11f995c3bd0e4204.png)" }} onClick={() => switchDevice(1)} autoFocus={true}></button>
                            <div className="type-text">电视设备</div>
                        </div>
                        <div className="type-choice" >
                            <button className="type-img" style={{ backgroundImage: "url(https://s3.bmp.ovh/imgs/2022/01/77631ede80de728d.png)" }} onClick={() => switchDevice(0)}></button>
                            <div className="type-text">触控设备</div>
                        </div>
                    </div>
                }
            </Fragment>
        )
    }

}

root.render(<App />)