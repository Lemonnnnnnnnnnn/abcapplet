// Taro 组件
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

// 自定义组件
import BaseComponent from '@components/base'
import ImagePlaceholder from '@components/image-placeholder'

// NPM 包
import classNames from 'classnames'


class ServiceItem extends BaseComponent {
  static defaultProps = {
    width: 573,
    height: 346,
    minWidth: 330,
    minHeight: 222,
    mini: false,
    service: { cover: '' },
    className: '',
  }


  render() {
    let { width, height, minWidth, minHeight, mini } = this.props
    const { className, service} = this.props

    // 重置宽高
    width = mini ? minWidth : width
    height = mini ? minHeight : height

    const { cover } = service

    console.log('============')
    console.log(this.props)
    // const headerStyle = {
    //   width: '100%',
    //   height: Taro.pxTransform(height),
    // }

    // 设置图片宽高，方便七牛云格式化图片
    const src = `${cover.split('?')[0]}?imageView2/1/w/${width}/h/${height}`

    return (

        <View className={classNames('apartment', className)} onClick={this.onNavigation}>
          {/* 行程头部 */}
          <View className='apartment-header m-2' >

            {/* 户型封面，如果没有地址则使用 Image Placeholder 来占位 */}
            {cover
              ? <Image src={src} mode='scaleToFill' />
              : <ImagePlaceholder height={height} />
            }

          </View>
          <View className='at-row'>
            下半部分
          </View>
        </View>

    )
  }
}

export default ServiceItem
