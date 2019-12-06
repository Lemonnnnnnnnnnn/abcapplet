// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as articleActions from '@actions/article'
import * as apartmentActions from '@actions/apartment'

// NPM 包
import day from 'dayjs'

// 自定义常量
import { LOCALE_SHOW_DESC, LOCALE_RETURN_HOME } from '@constants/locale'
import { PAGE_HOME, PAGE_ARTICLE_SHOW, PAGE_ERROR } from '@constants/page'


// 自定义组件
import TabBar from '@components/tab-bar'
import RichTextWxParse from '@components/rich-text-wx-parse'
import ApartmentListMask from './components/apartment-list-mask'
import getPhoneSystem from '../../utils/error'
import buryPoint from '../../utils/bury-point'

@connect(state => state, {
  ...articleActions,
  ...apartmentActions,
})
class ArticleShow extends Component {
  config = {
    navigationBarTitleText: '文章详情',
    enablePullDownRefresh: true,
  }

  state = {
    showDesc: false,
    article: null,
    buttons: [
      { message: LOCALE_RETURN_HOME, method: 'onRetHome' },
      { message: LOCALE_SHOW_DESC, method: 'onShowDescToggle' },
    ],
  }

  componentWillMount() {
    buryPoint()
  }

  componentDidShow() {
    this.$router.params
    getPhoneSystem().then(res => {
      if (res === 'IOS9') {
        Taro.reLaunch({
          url: PAGE_ERROR
        })
      }
      if (res === 'NO_IOS9') {
        this.onLoad(this.$router.params)
      }
    }
    )
  }

  onLoad(params) {
    const { id } = params

    this.props.dispatchArticle({ id })
      .then(() => {
        const { articles, articleApartment } = this.props
        const article = articles.find(i => i.id == id)
        // 设置文章
        this.setState({ article })
        // 设置标题
        Taro.setNavigationBarTitle({ title: article.title })
        // 如果房间列表为空，去除查看详情按钮
        !articleApartment.total && this.setState({
          buttons: [
            { message: LOCALE_RETURN_HOME, method: 'onRetHome' }
          ]
        })

      })
      // 出错返回首页
      .catch(() => Taro.reLaunch({ url: PAGE_HOME }))
  }

  /**
   * 页面分享
   */
  onShareAppMessage() {
    const { article } = this.state
    return {
      title: article.title,
      path: `${PAGE_HOME}?page=${PAGE_ARTICLE_SHOW}&id=${article.id}`
    }
  }

  /**
   * 显示、关闭详情按钮
   */
  onShowDescToggle() {
    const { showDesc } = this.state
    this.setState({ showDesc: !showDesc })
  }

  onRetHome() {
    Taro.switchTab({ url: PAGE_HOME })
  }

  /**
   * 点击
   */
  onClick(method) {
    this[method]()
  }


  render() {
    const { articleApartment } = this.props
    const { article, buttons, showDesc } = this.state

    return (
      <View style={{ paddingBottom: Taro.pxTransform(120) }}>

        {article &&
          <View className='m-3' >
            <View>
              <View className='text-huge text-bold'>{article.title}</View>
              <View className='text-muted text-small mt-2'>{day.unix(article.create_time).format('YYYY-MM-DD')}</View>
            </View>
            <RichTextWxParse className='mt-2' content={article.content} />
          </View>
        }

        <TabBar
          hasShare
          show={!showDesc}
          buttons={buttons}
          onClick={this.onClick}
        />

        <ApartmentListMask
          show={showDesc}
          apartments={articleApartment.list}
          onClose={this.onShowDescToggle}
        />
      </View >
    )
  }
}

export default ArticleShow
