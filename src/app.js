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
      'pages/common/home',
      'pages/common/search',

      'pages/apartment/cbd',
      'pages/apartment/show',
      'pages/apartment/activity',
      'pages/apartment/recommend',
      'pages/apartment/house-type',
      'pages/apartment/appointment',
      'pages/apartment/search-room',

      'pages/appointment/services',
      'pages/appointment/message',
      // 'pages/appointment/mapHouse',
      // 'pages/appointment/commuteHouse',

      'pages/user/auth',
      'pages/user/profile',
      'pages/user/favorite',

      'pages/risk/index',
      'pages/risk/create',

      'pages/article/show',
      'pages/external/index',

    ],
    subPackages: [
      {
        root: 'pages/order',
        pages: [
          'index',
          'show',
          'create',
          'down-payment',
        ]
      }
    ],

    "permission": {
      "scope.userLocation": {
        "desc": "你的位置信息将用于小程序位置接口的效果展示"
      }
    },

    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '公寓ABC',
      navigationBarTextStyle: 'black',
    },
    tabBar: {
      color: "#4A4A4A",
      selectedColor: "#4A4A4A",
      backgroundColor: "#fff",
      borderStyle: "black",
      list: [
        {
          pagePath: "pages/common/home",
          text: "首页",
          iconPath: "assets/icons/home.png",
          selectedIconPath: "assets/icons/home-active.png"
        },
        {
          pagePath: "pages/appointment/services",
          text: "找房·行程",
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
    "permission": {
      "scope.userLocation": {
        "desc": "你的位置信息将用于小程序位置接口的效果展示"
      }
    }
  }

  componentDidMount() {
    this.autoUpdate()
  }

  //自动检测更新
  autoUpdate() {

    if (Taro.canIUse('getUpdateManager')) {
      //创建UpdateManager实例
      const updateManager = Taro.getUpdateManager();
      //检测版本更新
      updateManager.onCheckForUpdate((res) => {
        if (!res.hasUpdate) return;

        //请求更新
        updateManager.onUpdateReady(() => {
          Taro.showModal({
            title: '更新提示',
            content: '新版本已经准备好了，是否重启应用？',
            success: (res) => res.confirm && updateManager.applyUpdate(),
          });
        });

        //更新失败
        updateManager.onUpdateFailed(() => {
          Taro.showModal({
            title: '已经有新版本咯~~',
            content: '新版本已经上线，请您删除当前小程序，重新搜索打开。',
          });
        });

      });
    } else {
      //希望用户在最新版本的客户端上体验您的小程序
      Taro.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试'
      })
    }

  }

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
