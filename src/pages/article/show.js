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
    statusBarHeight: 0,
    navHeight: 0,
    buttons: [
      { message: LOCALE_SHOW_DESC, method: 'onShowDescToggle' },
    ],
  }

  async componentDidMount() {
    await Taro.getSystemInfo().then(res => {
      this.setState({ navHeight: 72, statusBarHeight: res.statusBarHeight })
      if (res.model.indexOf('iPhone X') !== -1) {
        this.setState({ navHeight: 88, statusBarHeight: res.statusBarHeight })
      } else if (res.model.indexOf('iPhone') !== -1) {
        this.setState({ navHeight: 64, statusBarHeight: res.statusBarHeight })
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
    const {  articleApartment } = this.props
    const { article, buttons, showDesc, navHeight, statusBarHeight } = this.state

    const navStyle = {
      height: navHeight ? Taro.pxTransform(navHeight * 2) : Taro.pxTransform(128),
    }

    const statusBarStyle = {
      height: statusBarHeight ? Taro.pxTransform(statusBarHeight * 2) : Taro.pxTransform(40)
    }

    const titleStyle = {
      height: navHeight && statusBarHeight ? Taro.pxTransform((navHeight - statusBarHeight) * 2) : Taro.pxTransform(88),
    }


    return (
      // 自定义导航栏
      <View style={{ paddingBottom: Taro.pxTransform(120), paddingTop: navHeight + "px" }}>
        <View className='navStyle' style={navStyle} >
          {/* 状态栏 */}
          <View style={statusBarStyle}></View>
          {/* 标题栏 */}
          <View style={{ position: "relative" }}>
            <View className='at-row at-row__align--center  ml-2  navStyle-titleStyle' style={titleStyle} >
              <View className='at-row at-row-3 at-row__align--center at-row__justify--between navStyle-menuButtonStyle'>
                <View className='at-col-6'>
                  <AtIcon onClick={this.onReturn} value='chevron-left' size='22' className='ml-2' ></AtIcon>
                </View>
                <View className='grayLineStyle' ></View>
                <Image onClick={this.onBackHome} src='https://images.gongyuabc.com//image/backHome.png' className='mr-2' style={{ height: "17px", width: "17px" }}></Image>
              </View>
            </View>
            {/* title */}
            <View className='text-normal navStyle-titleFontStyle'>{article.title}</View>
          </View>
        </View>


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
