import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

class ApartmentRecommend extends Component {
  config = {
    navigationBarTitleText: '优选',
  }

  openMiniProgram() {
    Taro.navigateToMiniProgram({
      appId: 'wxd3537ccb429de3b4'
    });
  }

  render() {
    return (
      <View
        className='page-recommend'
        onClick={this.openMiniProgram}
      >
      </View>
    )
  }
}

export default ApartmentRecommend
