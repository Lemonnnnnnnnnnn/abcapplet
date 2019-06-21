// Taro 组件
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtTag } from 'taro-ui'

// 自定义组件
import BaseComponent from '@components/base'

// NPM 包
import classNames from 'classnames'
import ImagePlaceholder from '@components/image-placeholder'

class Apartment extends BaseComponent {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    apartment: {},
    height: 346,
    width: 573,
    className: '',
  }

  render() {
    const { apartment, height, width, className } = this.props
    const { cbd, cover, title, rules, desc, price_title: priceTitle, apartment_title: apartmentTitle } = apartment

    const imageStyle = {
      width: '100%',
      height: '100%',
    }

    const headerStyle = {
      width: '100%',
      height: `${Taro.pxTransform(height)}`,
    }

    const price = priceTitle ? parseInt(priceTitle) : 0

    const src = `${cover}?imageView2/1/w/${width}/h/${height}`

    return (
      <View className={classNames('apartment', className)}>
        <View className='apartment-header' style={headerStyle}>
          {cover
            ? <Image src={src} mode='scaleToFill' style={imageStyle} />
            : <ImagePlaceholder height={height} />
          }
          <View className='apartment-header-title'>{cbd && cbd.map(i => i.title).toString().replace(',', ' / ')}</View>
          <View className='apartment-header-type'>{title}</View>
        </View>
        <View className='apartment-content mx-3 py-3'>
          <View>{rules.map((item, index) => <AtTag className='mr-1 p-1 text-mini' key={index} size='small' circle>{item}</AtTag>)}</View>
          <View className='at-row at-row__justify--between at-row__align--end'>
            <View className='apartment-content-main'>
              <View className='text-bold mt-2'>{apartmentTitle}</View>
              {desc && <View className='text-muted mt-2 text-small apartment-content-desc'>{desc}</View>}
            </View>
            <View className='text-yellow text-huge text-bold'>{price === 0 ? '暂无数据' : `￥${price}起`}</View>
          </View>
        </View>
      </View>
    )
  }
}

export default Apartment
