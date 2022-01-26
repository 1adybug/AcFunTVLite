# AcFunTVLite
这是我的首个 React Native 项目

# React Native 项目核心组件
1. [react-native-webview](https://github.com/react-native-webview/react-native-webview)
2. [react-native-fs](https://github.com/itinance/react-native-fs)
3. [react-native-storage](https://github.com/sunnylqm/react-native-storage)
4. [axios](https://github.com/axios/axios)

# WebView 中用到核心组件
1. [react](https://github.com/facebook/react)
2. [babel](https://babeljs.io/)
3. [xgplayer](https://github.com/bytedance/xgplayer)

# 1.0 版本原理
通过 WebView 组件的 `injectedJavaScript` 功能，在页面上注入JS。`source` 是 A站的 About 页面。在这个页面请求各种数据，搭配 React 改写页面，自写 UI，通过西瓜播放器实现视频播放和弹幕之类的核心功能。遥控器的功能通过 `document.addEventListener` 中的 `keydown` 和 `keyup` 实现，上下左右确认的操作的逻辑都是通过 React 实现，为了防止系统的默认事件，还采用了 `e.preventDefault()` 和 `e.cancelBubble()`

## 使用 About 页面的原因
1. 页面比较干净，没啥后台占用
2. 防止跨域问题

# 2.0 版本原理
尝试使用 React Native 的原生组件来代替，但是无法监听到键盘事件。通过 Google，采用了 [react-native-keyevent](https://github.com/kevinejohn/react-native-keyevent) 组件，可以监听到 keyup 和 keydown 事件。几乎实现了全部功能，但是仍有以下问题：
1. React Native 原生组件似乎并没有比 WebView 的性能要高，尤其是在列表页面，即使采用了 FlatList 组件，比起 WebView 的渲染，性能依旧较差
2. React Native 的 API 和组件相比 WebView 少了很多，图片的显示也有问题
3. 没有找到合适的基于 React Native 的弹幕播放器，老外视乎并没有这方面的兴趣
4. keyevent 的问题，如果劫持了系统的按键事件，音量键失效，如果不劫持，返回键失效，虽然我后面解决了，但是也还是很蛋疼

# 3.0 版本原理
与 1.0 类似，核心方案依旧是 WebView，只不过把核心页面从 About 中剥离开来，跨域的问题交给 React Native 来解决，只要是网络请求都由 React Native 中的 Axios 来发起。

# 4.0 版本原理
我惊讶地发现 WebView 本身其实适配了遥控器！！！！！！！
只要给一个 element 加上 Click 事件，遥控器上下左右，WebView 将会自动 Focus 具有 Click 事件的元素！按下确认键，WebView 将会自动触发当前 Foucs 元素的 Click 事件！
早知道，我先做平板版本的不就行了！
然后就是一些细节上的修修补补，不要再通过 `document.addEventListener` 来实现遥控器的功能了。
但是播放页面还是要绑定遥控器事件的，要不然快进快退和调出控制界面无法实现，我通过以下的小办法实现了。
在播放页面上，放入五个很小的 button
- `上`
- `左`  `中`  `右`
- `下`  

只要播放器加载完成，就显示这五个按钮，并且 Focus `中` 这个按钮，
1. 此时如果按下确认键，就会触发 `中` 这个按钮的点击事件：播放或者暂停视频
2. 如果按下上下键，就会触发 `上` 和 `下` 的 `onFocus` 事件，调出控制界面，这五个按钮就会隐藏，退出控制界面时，再 Focus `中` 这个按钮
3. 按下左右键，就会触发 `左` 或者 `右` 的 `onFocus` 事件，快退或者快进视频，并且再次 Focus `中` 这个按钮，这样就能保证`中` 这个按钮永远是 Focus 状态，长按左键或者右键，就可以实现一直快退或者快进

# 播放器的核心原理以及 API
请看西瓜播放器的官网 [西瓜播放器](http://v2.h5player.bytedance.com/)

# WebView 的核心文件
都在 `android\app\src\main\assets` 目录下
- `react.production.min.js` 对应 react
- `react-dom.production.min.js` 对应 react-dom
- `babel.min.js` 对应 babel
- `xgplayer.js` 对应 西瓜播放器
- `HlsJsPlayer.js` 对应 西瓜播放器的 hls 播放器组件，用于播放 m3u8
- `main.js` 对应 WebView 的核心代码