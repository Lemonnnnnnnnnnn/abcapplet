import '@tarojs/async-await'
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'
import Index from './pages/index'
import configStore from './store'
import initProject from './utils/init'
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
      'pages/home/home',
      'pages/recommend/recommend',
      'pages/appoint/services',
      // 'pages/appointment/maphouse',
      // 'pages/appointment/commutehouse',
      'pages/owner/profile',
    ],
    subPackages: [
      {
        root: 'pages/apartment',
        pages: [
          'cbd',
          'show',
          'activity',
          'house-type',
          'appointment',
          'search-room',

        ]
      },
      {
        root: 'pages/common',
        pages: [
          'search',
        ]
      },
      {
        root: 'pages/appointment',
        pages: [
          'message',
          'detail',
          'audit',

        ]
      },
      {
        root: 'pages/user',
        pages: [
          'auth',
          'favorite',
          'coupon',
          'feedback',

        ]
      },
      {
        root: 'pages/order',
        pages: [
          'index',
          'show',
          'create',
          'down-payment',
          'deposit-bar',
        ]
      },
      {
        root: 'pages/risk',
        pages: [
          'index',
          'create',
          'landing-page'
        ]
      },
      {
        root: 'pages/article',
        pages: [
          'show',
        ]
      },
      {
        root: 'pages/external',
        pages: [
          'index',
          'coupon_receive'
        ]
      },
    ],

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
          pagePath: "pages/home/home",
          text: "首页",
          iconPath: "assets/icons/home.png",
          selectedIconPath: "assets/icons/home-active.png"
        },
        {
          pagePath: "pages/appoint/services",
          text: "找房·行程",
          iconPath: "assets/icons/services.png",
          selectedIconPath: "assets/icons/services-active.png"
        },
        {
          pagePath: "pages/recommend/recommend",
          text: "转租",
          iconPath: "assets/icons/recommend.png",
          selectedIconPath: "assets/icons/recommend-active.png"
        },
        {
          pagePath: "pages/owner/profile",
          text: "我的",
          iconPath: "assets/icons/profile.png",
          selectedIconPath: "assets/icons/profile-active.png"
        }
      ],
    },
    navigateToMiniProgramAppIdList: [
      "wxd3537ccb429de3b4",
      "wx798afaa9c187b6ae"
    ],
    "permission": {
      "scope.userLocation": {
        "desc": "你的位置信息将用于小程序位置接口的效果展示"
      }
    }
  }

  componentWillMount() {
    this.autoUpdate()
    initProject()
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
