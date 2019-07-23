// Taro 组件
import Taro from '@tarojs/taro'
import { AtButton, AtIcon } from 'taro-ui'
import { View, Text, Image } from '@tarojs/components'
import Masks from '@components/masks'
import Board from '@components/board'

// 自定义组件
// import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'


class AppartmentMatchingMask extends BaseComponent {

    static defaultProps = {
        show: false,
        facilitys: []
    }


    render() {
        const { show, facilitys ,onClose} = this.props
        const roomMatch = facilitys.find(i=>{return i.type===2})
        const publicMatch = facilitys.find(i=>{return i.type===1})

        const PublicConfiguration = {
            padding: " 5px 5px"
        }


        return (
            show && <View className=' apartment-mask'>
                <Board fixed='bottom' border='top'>
                    <AtIcon onClick={onClose} value='close' size='15' className='mt-3 mr-3' color='#888' style='float:right'></AtIcon>
                    <View style={{ textAlign: "center" }} className='text-huge text-bold mt-2'> 全部配套</View>
                    <View className='mt-4 ml-4 mr-4 '>
                        <View >
                            <View className='mb-3'>房间配套</View>
                            <View className='at-row at-row--wrap'>
                                {facilitys.map(i =>
                                    i.type === 2 && <View style={PublicConfiguration} key={i.title} className='at-col at-col-2 text-center mr-2'>
                                        <Image src={i.icon} mode='aspectFit' style={{ height: '30px', width: '30px' }} />
                                        <View className='text-small'>{i.title}</View>
                                    </View>
                                )}
                                {roomMatch ? <View></View>: <View className='text-secondary'>暂无相关数据</View> }
                            </View>
                        </View>

                        <View className='mt-4 '>
                            <View className='mb-3'>公共配套</View>
                            <View className='at-row '>
                                {facilitys.map(i =>
                                    i.type === 1 && <View style={PublicConfiguration} key={i.title} className='at-col at-col-1 text-center at-col--auto  mr-2'>
                                        <Image src={i.icon} mode='aspectFit' style={{ height: '30px', width: '30px' }} />
                                        <View className='text-small'>{i.title}</View>
                                    </View>
                                )}
                                {publicMatch ? <View></View>: <View className='text-secondary text-smail'>暂无相关数据</View> }
                            </View>
                        </View>
                    </View>
                    <View style={{ height: "20vw" }}></View>
                </Board>
                <Masks show={show} />

            </View>

        )
    }
}

export default AppartmentMatchingMask
