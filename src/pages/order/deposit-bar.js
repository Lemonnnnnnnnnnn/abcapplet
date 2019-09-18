import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import BaseComponent from '@components/base'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as orderActions from '@actions/order'

// NPM 包
import day from 'dayjs'

@connect(state => state, {
    ...orderActions,
})

export default class DepositBar extends BaseComponent {

    config = {
        navigationBarTitleText: '定金条',
        navigationBarBackgroundColor: '#FFE07A',
    }

    state = {
        name: '',
        serviceName: ' 公寓ABC ',
        apartment_title: '',
        customerPhone: '',
        apartmentPhone: '',
        roomNum: '',
        price: '',
        time: '',
    }

    async componentWillMount() {
        const { id, roomId } = this.$router.params

        const { data: { data } } = await this.props.dispatchOrderShow({ id })

        let signTime = day.unix(data.sign_time).format('YYYY年MM月DD日')

        let server_user_mobile = ''
        if(data.server_user){
            server_user_mobile = data.server_user.mobile
        }
        
        this.setState({
            name: data.name,
            apartment_title: data.apartment_title,
            customerPhone: data.mobile,
            apartmentPhone: server_user_mobile,
            roomNum: roomId,
            price: data.price,
            time: signTime
        })

    }

    render() {
        const { name, serviceName, apartment_title, customerPhone, apartmentPhone, roomNum, price, time } = this.state

        const bgStyle = {
            minHeight: '100vh',
            background: 'linear-gradient(#FFE07A,#FFA319)',
        }
        const wrapStyle = {
            background: '#fff',
            borderRadius: Taro.pxTransform(24),
            width: '80%',
        }
        const messageStyle = {
            width: '50%',
            float: 'left',
        }

        const dashedStyle = {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
        }

        const textArr = [
            '已确认收到公寓ABC平台为签约入住人 ' + name + ' (手机号：' + customerPhone + ' ）代理预订的 ' + apartment_title + '  公寓房间号为 ' + roomNum + ' 的预订定金（人民币）' + price + ' 元。',
            '将为签约入住人保留房源至 ' + time + ' ，请签约入住人在此日期前前往公寓办理正式租房合同，逾期定金将失效，定金不予退还。',
        ]
        const messageArr = [
            { title: '收款公寓:', content: apartment_title },
            { title: '代理预定服务方:', content: serviceName },
            { title: '确认管家（手机号）:', content: apartmentPhone },
            { title: '签约入住人（手机号）:', content: customerPhone },
        ]

        return (
            <View style={bgStyle}>
                <View style={wrapStyle} className='p-3 level-center mt-3'>
                    <View className='mb-3 text-large text-bold at-row at-row__justify--center'>定金凭证</View>
                    {
                        textArr.map(i => <View key={i} className='mb-3 text-normal text-indent'>{i}</View>)
                    }
                    <View style={dashedStyle} className='text-secondary'>- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - </View>
                    <View className=''>
                        {
                            messageArr.map(i =>
                                <View className='mt-3' style={messageStyle} key={i} >
                                    <View className='text-secondary text-normal'>{i.title}</View>
                                    <View className='text-normal mt-1'>{i.content}</View>
                                </View>)
                        }
                    </View>
                </View>

            </View>
        );
    }
}