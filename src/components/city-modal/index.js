import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import cityModelBackground from '@assets/images/home/city-modal.png'
import { AtModal, AtModalHeader, AtModalContent } from 'taro-ui'
import { COLOR_YELLOW } from '@constants/styles'

class CityModal extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    citycode: 0,
    cityList: [],
  }

  render() {
    const { citycode, cityList, onSelectCity } = this.props

    const style = {
      width: '100%',
      height: '100%',
      background: COLOR_YELLOW,
    }

    return (citycode === 0 &&
      <AtModal className='city-modal' isOpened>

        {/* 模态框头部 */}
        <AtModalHeader>
          <Image src={cityModelBackground} style={style} ></Image>
        </AtModalHeader>

        {/* 模态框内容 */}
        <AtModalContent className='city-modal-content'>
          <View className='city-modal-content-box'>
            <View class='city-modal-title'>请选择当前租房位置</View>
          </View>
        </AtModalContent>

        {/* 模态框操作 */}
        <AtModalContent className='city-modal-action'>
          {cityList.map(item =>
            <View
              className='city-modal-item'
              key={item.id}
              onClick={onSelectCity.bind(this, item)}
            >{item.title}</View>
          )}
        </AtModalContent>
      </AtModal>
    )
  }
}

export default CityModal
