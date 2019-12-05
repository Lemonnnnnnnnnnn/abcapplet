import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtButton } from 'taro-ui'
import { CITY_MODAL_ICON } from "@constants/picture";
import { LOCALE_CHOISE_RENT_POSITION } from '@constants/locale'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'

@connect(state => state, {
  ...userActions,
})
class CityModal extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    citycode: 0,
    city: [],
  }

  async componentDidShow() {
    const { code } = await Taro.login()
    Taro.setStorageSync('code', code)
  }

  render() {
    const { citycode, city, onSelectCity } = this.props

    const greyLine = {
      width: '60%',
      borderBottom: '1px solid #E5E5E5',
    }

    const iconWeight = Taro.pxTransform(30)
    const iconHeight = Taro.pxTransform(36)

    return (!citycode &&
      <AtModal
        isOpened
        className='city-modal'
        closeOnClickOverlay={false}
      >

        {/* 模态框头部 */}
        <View style={{ height: Taro.pxTransform(160) }}>
          <View className='at-row at-row__justify--center city-modal-header'>
            <View className='at-row at-row__align--center at-row__justify--center'>
              <Image lazyLoad src={CITY_MODAL_ICON} style={{ height: iconHeight, width: iconWeight }}></Image>
              <View className='text-large text-bold ml-2'>{LOCALE_CHOISE_RENT_POSITION}</View>
            </View>
          </View>
          <View className='at-row at-row__align--center at-row__justify--center mt-2'>
            <View className='yellow-line'></View>
          </View>

        </View>

        {/* 模态框操作 */}
        <AtModalContent className='city-modal-action mb-2'>
          {city.map((item, key) =>
            <View key={item.id}>
              <AtButton
                // openType='getPhoneNumber'
                // onGetPhoneNumber={this.getPhoneNumber.bind(this, item.id)}
                onClick={onSelectCity.bind(this, item.id, item.title , item.sort)}
              >
                <View className='city-modal-item text-center p-2 text-secondary'>
                  {item.title}
                </View>
              </AtButton>
              <View className='at-row at-row__align--center at-row__justify--center'>
                <View style={key + 1 === city.length ? '' : greyLine} ></View>
              </View>
            </View>
          )}
        </AtModalContent>
      </AtModal>
    )
  }
}

export default CityModal
