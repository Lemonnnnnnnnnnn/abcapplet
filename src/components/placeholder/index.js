import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import classNames from 'classnames'

class Placeholder extends Component {

  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    className: '',
    quantity: 1,
    show: false,
    type: ''
  }

  render() {
    const classValue = classNames(
      'ui placeholder',
      this.props.className
    )
    const { show, quantity, type } = this.props
    const length = parseInt(quantity)
    const items = Array.from({ length })

    return (
      <View>
        {
          show &&
          items.map(i =>
            <View key={i}>
              <View className='mt-3'>
                <View className='spinner'>
                  <View className='bounce1'></View>
                  <View className='bounce2'></View>
                  <View className='bounce3'></View>
                </View>
                {/* <View class='page-middile text-normal'>正在加载...</View> */}
                {/* <View className='image rectangular'></View>
                <View className='line'></View>
                <View className='very short line'></View> */}
              </View>
            </View>
          )
        }
      </View>
    )
  }
}

export default Placeholder
