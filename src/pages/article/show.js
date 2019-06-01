import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import * as actions from '@actions/article'
import RichTextWxParse from '@components/rich-text-wx-parse'
import day from 'dayjs'

@connect(state => state, actions)
class ArticleShow extends Component {
  config = {
    navigationBarTitleText: '文章详情',
    enablePullDownRefresh: true,
  }

  componentWillMount() {
    const { title = '', id = 5 } = this.$router.params
    const { articles } = this.props

    // 判断文章是否存在，不存在则加载
    const article = articles.filter(i => i.id === parseInt(id)).length > 0
    article || this.props.dispatchArticle(parseInt(id))

    // 设置标题
    Taro.setNavigationBarTitle({ title })
  }

  render() {
    const { articles } = this.props
    const { id = 5 } = this.$router.params
    const article = articles.filter(i => i.id === parseInt(id))[0] || null
    // Taro.setNavigationBarTitle({ title: article ? article.title : '' })

    return (
      <View>
        {article &&
          <View>
            <View className='m-2'>
              <View className='text-huge text-bold'>{article.title}</View>
              <View className='text-muted text-small'>{day.unix(article.create_time).format('YYYY-MM-DD')}</View>
            </View>
            <RichTextWxParse content={article.content} />
          </View>
        }
      </View>
    )
  }
}

export default ArticleShow
