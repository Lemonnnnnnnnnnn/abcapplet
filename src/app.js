import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import Index from './pages/index'
import configStore from './store'
import './styles/app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()

class App extends Component {

  config = {
    pages: [
      "pages/apartment/home",

      "pages/user/favorite",
      "pages/user/profile",
      "pages/user/auth",

      "pages/apartment/recommend",
      "pages/apartment/services",

      "pages/article/show",
      "pages/external/index",
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '公寓ABC',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: "#4A4A4A",
      selectedColor: "#4A4A4A",
      backgroundColor: "#fff",
      borderStyle: "black",
      list: [
        {
          pagePath: "pages/apartment/home",
          text: "首页",
          iconPath: "assets/icons/home.png",
          selectedIconPath: "assets/icons/home-active.png"
        },
        {
          pagePath: "pages/apartment/services",
          text: "找房",
          iconPath: "assets/icons/services.png",
          selectedIconPath: "assets/icons/services-active.png"
        },
        {
          pagePath: "pages/apartment/recommend",
          text: "优选",
          iconPath: "assets/icons/recommend.png",
          selectedIconPath: "assets/icons/recommend-active.png"
        },
        {
          pagePath: "pages/user/profile",
          text: "我的",
          iconPath: "assets/icons/profile.png",
          selectedIconPath: "assets/icons/profile-active.png"
        }
      ],
    },
    navigateToMiniProgramAppIdList: [
      "wxd3537ccb429de3b4"
    ],
  }

  componentDidMount() { }

  componentDidShow() { }

  componentDidHide() { }

  componentCatchError() { }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
