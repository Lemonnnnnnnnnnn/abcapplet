import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

class ArticleShow extends Component {
  config = {
    navigationBarTitleText: '文章详细',
    enablePullDownRefresh: true,
  }

  render() {
    return (
      <View className='page-demo'>
        <Text>文章详细</Text>
      </View>
    )
  }
}

export default ArticleShow
