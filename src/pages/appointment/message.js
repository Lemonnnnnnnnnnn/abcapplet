import Taro, { Component  } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import Board from '@components/board'

import  {PAYLOAD_MESSAGE_CREATE } from '@constants/api'
import { LOCALE_APPOINTMENT_MESSAGE_LIU } from '@constants/locale'

// Redux 相关
import { connect } from '@tarojs/redux'

import * as messageActions from '@actions/message'
import AppointmentMessageList from '@components/appointment-message-list'

@connect(state => state , {
  ...messageActions,

})

class ServicesHome extends Component {
  config = {
    navigationBarTitleText: '行程留言',
  }
  state = {
    id:'',
    time:'',
    appointmentTitle:'',
    appointmentTime:'',
    content:'',
    payload:PAYLOAD_MESSAGE_CREATE,//{ appointment_id: 0, content:''}

  }

  componentWillMount() {
    const {id,time,appointmentTime,appointmentTitle } = this.$router.params
    this.setState({
      id:id,
      time : time,
      appointmentTitle : appointmentTitle,
      appointmentTime : appointmentTime
    })

  // 获取数据
    if (id) {
      this.setState({ id })
      this.props.dispatchMessageList({appointment_id:id})
        .then(() => this.pageScrollToBottom())
    }

  }

  pageScrollToBottom() {
    Taro.createSelectorQuery()
      .in(this.$scope)
      .select('.message-background')
      .boundingClientRect(rect =>

        Taro.pageScrollTo({
        scrollTop: rect.bottom
      })
      )
      .exec()
  }

  onMessageInput({ currentTarget: { value } }) {
    this.setState({ content: value })
  }

  onMessageSend({ currentTarget: { value } }) {
    const { id ,payload} = this.state
    this.setState({ content: '' })
    this.props.dispatchMessageCreate({ ...payload, content: value, appointment_id:id })
      .then(() => this.props.dispatchMessageList({appointment_id:id}).then(() => this.pageScrollToBottom()))
  }


  render() {
    const {time,appointmentTime,appointmentTitle ,content} = this.state
    const { message } = this.props
    const { list } = message

    return (
        <View className='message-background' style={{ 'padding-top': '75px', 'padding-bottom': '65px' }}>
          {/* 头部 */}
          <View class='board--grey board--fixed-top ' >
            <Board className='px-3 py-2 pl-2' border='bottom'>
              <View className=' text-small text-secondary'>{LOCALE_APPOINTMENT_MESSAGE_LIU}</View>
              <View className='mt-2 at-row at-row__align--center text-normal'>
                <View className='button-yellow'></View>
                <View className='button--dot ml-2'>{appointmentTitle}</View>
                <View className='pl-2'>{time}</View>
                <View className='pl-2'>{appointmentTime}</View>
              </View>
            </Board>
          </View>

          <View className='mx-2' >
            <AppointmentMessageList items={list || []} />
          </View>

          <View class=' board--fixed' >
            <Board className='message-textarea' border='none' fixed>
              <Input
                className='p-2'
                value={content}
                type='text'
                onInput={this.onMessageInput}
                onConfirm={this.onMessageSend}
                placeholder='请输入消息内容'
              />
            </Board>
          </View>
        </View>

    )
  }
}

export default ServicesHome
