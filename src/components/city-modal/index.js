import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
// import cityModelBackground from '@assets/images/home/city-modal.png'
import { AtModal, AtModalHeader, AtModalContent } from 'taro-ui'
import { COLOR_YELLOW } from '@constants/styles'

class CityModal extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    citycode: 0,
    city: [],
  }

  render() {
    const { citycode, city, onSelectCity } = this.props

    const cityModalHeaderstyle = {
      width: '100%',
      height: '60%',
    }

    const yellowLine = {
      height: Taro.pxTransform(5),
      width: Taro.pxTransform(54),
      background: COLOR_YELLOW,
    }

    const greyLine = {
      width: '60%',
      borderBottom: '1px solid #E5E5E5',
    }

    const iconWeight = Taro.pxTransform(30)
    const iconHeight = Taro.pxTransform(36)

    return (citycode === 0 &&
      <AtModal
        isOpened
        className='city-modal'
        closeOnClickOverlay={false}
      >

        {/* 模态框头部 */}
        <View style={{ height: Taro.pxTransform(160) }}>
          {/* <Image src='https://images.gongyuabc.com//image/city-modal.png' style={style} ></Image> */}
          <View style={cityModalHeaderstyle} className='at-row at-row__justify--center'>
            <View className='at-row at-row__align--center at-row__justify--center'>
              <Image src='https://images.gongyuabc.com/image/city_modal_icon.png' style={{ height: iconHeight, width: iconWeight }}></Image>
              <View className='text-large text-bold ml-2'>请选择租房位置</View>
            </View>
          </View>
          <View className='at-row at-row__align--center at-row__justify--center mt-2'>
            <View style={yellowLine}></View>
          </View>

        </View>

        {/* 模态框操作 */}
        <AtModalContent className='city-modal-action mb-2'>
          {city.map((item, key) =>
            <View key={item.id}>
              <View
                className='city-modal-item text-center p-2 text-secondary'
                onClick={onSelectCity.bind(this, item.id)}
              >{item.title}</View>
              <View className='at-row at-row__align--center at-row__justify--center'>
                <View style={key + 1 === city.length ? '' : greyLine}></View>
              </View>
            </View>
          )}
        </AtModalContent>
      </AtModal>
    )
  }
}

export default CityModal
