import Taro, { Component } from '@tarojs/taro'
import { WebView } from '@tarojs/components'

import buryPoint from '../../utils/bury-point'


class ExternalIndex extends Component {
  config = {
    navigationBarTitleText: '访问外部链接',
    enablePullDownRefresh: true,
  }

  state = { src: '' }

  componentWillMount() {
    buryPoint()
    const { title = '', src = '' } = this.$router.params

    // 设置网页
    this.setState({ src })

    // 设置标题
    Taro.setNavigationBarTitle({ title })
  }

  render() {
    const { src } = this.state

    return (
      <WebView src={src}></WebView>
    )
  }
}

export default ExternalIndex
