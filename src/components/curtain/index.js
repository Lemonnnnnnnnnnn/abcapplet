import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image, Swiper, SwiperItem } from '@tarojs/components';
import { AtCurtain } from 'taro-ui'

// 自定义组件
import BaseComponent from '@components/base'

// 自定义变量
import { PAGE_EXTERNAL_INDEX } from '@constants/page'
import { COLOR_DOATS_CAROUSEL, COLOR_YELLOW } from '@constants/styles'

import '../../styles/_curtain.scss'

export default class Curtain extends BaseComponent {
  static defaultProps = {
    swiperHeight: 800,
  }

  onNavigation(url) {
    let newUrl = url

    if (url === '') return;

    // 判断是否为外链
    const externalLink = /(http|https):\/\/([\w.]+\/?)\S*/
    const isExternal = url.search(externalLink) !== -1
    if (isExternal) {
      newUrl = `${PAGE_EXTERNAL_INDEX}?src=${url}`
    } else {
      newUrl = `${url}`
    }

    return Taro.navigateTo({ url: newUrl })
  }

  render() {
    const { isOpened, adList, swiperHeight } = this.props

    // 轮播高度
    const swiperStyle = { height: `${Taro.pxTransform(swiperHeight)}` }
    const imageStyle = { width: '80%' }

    return (isOpened &&
      <View>
        <AtCurtain isOpened onClose={this.props.onClose}>
          <Swiper
            autoplay
            circular
            indicatorDots
            indicatorActiveColor={COLOR_YELLOW}
            indicatorColor={COLOR_DOATS_CAROUSEL}
            style={swiperStyle}
          >
            {
              adList.map(i =>
                <SwiperItem key={i.id} onClick={this.onNavigation.bind(this, i.url)}>
                  <View className='curtain-wrap'>
                    <Image src={i.cover} mode='widthFix' style={imageStyle} className='vertical-level-center' />
                  </View>
                </SwiperItem>
              )
            }

          </Swiper>
        </AtCurtain>
      </View>
    );
  }
}
