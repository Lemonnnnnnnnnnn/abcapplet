// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as articleActions from '@actions/article'
import * as apartmentActions from '@actions/apartment'

// 自定义组件
import TabBar from '@components/tab-bar'
import RichTextWxParse from '@components/rich-text-wx-parse'
import ApartmentListMask from '@components/apartment-list-mask'
import CustomNav from '@components/custom-nav'

// NPM 包
import day from 'dayjs'

// 自定义常量
import { LOCALE_SHOW_DESC } from '@constants/locale'
import { PAGE_HOME, PAGE_ARTICLE_SHOW } from '@constants/page'

@connect(state => state, {
  ...articleActions,
  ...apartmentActions,
})
class ArticleShow extends Component {
  config = {
    navigationBarTitleText: '文章详情',
    enablePullDownRefresh: true,
    navigationStyle: 'custom',
  }

  state = {
    showDesc: false,
    article: null,
    navHeight: 0,
    buttons: [
      { message: LOCALE_SHOW_DESC, method: 'onShowDescToggle' },
    ],
  }

  async componentDidMount() {
    await Taro.getSystemInfo().then(res => {
      this.setState({ navHeight: 72})
      if (res.model.indexOf('iPhone X') !== -1) {
        this.setState({ navHeight: 88})
      } else if (res.model.indexOf('iPhone') !== -1) {
        this.setState({ navHeight: 64})
      }
    })
  }

  componentDidShow() {
    const { id } = this.$router.params

    this.props.dispatchArticle({ id }).then(() => {
      const article = this.props.articles.find(i => i.id == id)
      // 设置文章
      this.setState({ article })
      // 设置标题
      Taro.setNavigationBarTitle({ title: article.title })
    })
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

  /**
   * 点击
   */
  onClick(method) {
    this[method]()
  }

  onReturn() {
    Taro.navigateBack()
  }

  onBackHome() {
    Taro.switchTab({
      url: PAGE_HOME
    })
  }

  render() {
    const { articleApartment } = this.props
    const { article, buttons, showDesc, navHeight } = this.state


    let articleChange = ''

    if (article) {
      if (article.title.length > 10) {
        articleChange = article.title.substr(0, 10) + "..."
      } else {
        articleChange = article.title
      }
    }



    return (
      <View style={{ paddingBottom: Taro.pxTransform(120), paddingTop: navHeight + "px" }}>

        <CustomNav title={articleChange} />


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
