/* eslint-disable react/jsx-indent-props */
// Taro 相关
import Taro from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'

// 自定义常量
import { COLOR_DOATS_CAROUSEL, COLOR_YELLOW } from '@constants/styles'
import { PAGE_ORDER_DOWN_PAYMENT } from '@constants/page'
import { ORDER_PROCESS } from '@constants/apartment'
import { LOCALE_ORDER_VIEW_AGREEMENT, LOCALE_ORDER_PROCESS_GUIDE } from '@constants/locale'

// 自定义组件
import Masks from '@components/masks'
import BaseComponent from '@components/base'


class OrderStepMask extends BaseComponent {

    static defaultProps = {
        show: false,
        contentHeight: 60 * 2,
        pictureHeight: 158 * 2,
        pictureWidth: 147 * 2,
        processArr: ORDER_PROCESS,
    }

    onMaskTouchMove(e) {
        return e.stopPropagation()
    }

    onNavigation() {
        Taro.navigateTo({ url: PAGE_ORDER_DOWN_PAYMENT })
    }

    render() {
        const { show, className, contentHeight, pictureHeight, pictureWidth, processArr } = this.props

        const contentStyle = { height: Taro.pxTransform(contentHeight) }
        const picStyle = {
            height: Taro.pxTransform(pictureHeight),
            width: '100%',
            overflow: 'hidden',
            position: 'relative'
        }
        const carouselStyle = { height: Taro.pxTransform(contentHeight + pictureHeight) }

        return (show && <View className={className} onTouchMove={this.onMaskTouchMove}>
            <View className='vertical-level-center apartment-order-step-mask'  >
                <View className='m-3'>
                    {/* 头部 */}
                    <View className='text-bold text-huge text-center'>{LOCALE_ORDER_PROCESS_GUIDE}</View>
                    {/* 轮播图 */}
                    <Swiper
                        className='mt-2'
                        autoplay
                        circular
                        indicatorDots
                        style={carouselStyle}
                        indicatorActiveColor={COLOR_YELLOW}
                        indicatorColor={COLOR_DOATS_CAROUSEL}
                    >
                        {processArr.map(i =>
                            <SwiperItem key={i} >
                                <View style={picStyle}>
                                    <Image
                                        // src={`${i.url}?imageView2/1/w/${imageWidth}/h/${imageHeight}`}
                                        src={i.url}
                                        style={{ height: '100%', width: Taro.pxTransform(pictureWidth) }}
                                        mode='withfix'
                                        className='carousel-image vertical-level-center'
                                    />
                                </View>
                                <View style={contentStyle}>
                                    <View className='mt-1 text-normal text-center text-yellow'>{i.title}</View>
                                </View>
                            </SwiperItem>
                        )}
                    </Swiper>
                    {/* 协议入口 */}
                    <View className='at-row at-row__align--center at-row__justify--center mt-3 mb-3'>
                        <View className='text-secondary text-normal' onClick={this.onNavigation}>{LOCALE_ORDER_VIEW_AGREEMENT}
                            <AtIcon value='chevron-right' size='14' color='#888888'></AtIcon>
                        </View>
                    </View>
                    {/* 按钮 */}
                    <AtButton
                        circle
                        className='btn-yellow active'
                        onClick={this.props.onClose}
                    >确定</AtButton>
                </View>
            </View>
            {/* </Board> */}

            {/* 遮罩层 */}
            <Masks show={show} />
        </View>)
    }
}

export default OrderStepMask
