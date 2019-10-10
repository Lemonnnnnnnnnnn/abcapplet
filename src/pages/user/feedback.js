import Taro, { Component } from '@tarojs/taro';
import { AtButton } from 'taro-ui'
import { View, Textarea, Input, } from '@tarojs/components'

import {
  LOCALE_FEEDBACK_QUESTION,
  LOCALE_FEEDBACK_TEL,
  LOCALE_FEEDBACK_DETAIL,
  LOCALE_FEEDBACK_COMFIRE,
} from '@constants/locale'

import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'

@connect(state => state, {
  ...userActions,
})


class feedback extends Component {

  config = {
    navigationBarTitleText: '建议反馈'
  }

  state = {
    feedbackTitle: '',
    telValue: '',
    weiValue: '',
  }
  //输入反馈意见
  onFeedback({ currentTarget: { value } }) {

    this.setState({
      feedbackTitle: value
    })
  }
  //输入电话号码
  onTel({ currentTarget: { value } }) {
    this.setState({
      telValue: value
    })
  }
  //输入微信号
  onWeiTel({ currentTarget: { value } }) {
    this.setState({
      weiValue: value
    })
  }

  //提交意见
  onComfire() {
    const { feedbackTitle, telValue, weiValue } = this.state
    if (telValue && !(/^1[3456789]\d{9}$/.test(telValue))) {
      Taro.showToast({
        title: '电话号码填写错误',
        icon: 'none',
        duration: 2000
      })
    } else {
      !feedbackTitle && Taro.showToast({
        title: '请填写反馈意见',
        icon: 'none',
        duration: 2000
      })
      feedbackTitle && this.props.dispatchFeedBack({ content: feedbackTitle, mobile: telValue, wechat_id: weiValue })
    }

  }


  render() {
    const { feedbackTitle, telValue, weiValue } = this.state
    return (
      <View className='p-3' style={{ backgroundColor: '#FFF', minHeight: '100vh' }}>
        <View className='text-large text-bold'>{LOCALE_FEEDBACK_QUESTION}</View>
        <View className='mt-3 text-normal py-2  textarea-feedback' >
          <Textarea
            className='mx-2 '
            style={{ height: '180px', width: '329px' }}
            value={feedbackTitle}
            maxlength={-1}
            placeholder='请输入反馈意见（必填）'
            onInput={this.onFeedback}
          />
        </View>

        <View className='mt-4 text-large text-bold'>{LOCALE_FEEDBACK_TEL}</View>

        <View className='text-normal at-row at-row__align--center  mt-3  input-tel ' >
          <Input
            type='number'
            className='ml-3'
            placeholder='输入电话号码（选填）'
            value={telValue}
            onInput={this.onTel}
          />
        </View>
        <View className='text-normal at-row at-row__align--center  mt-3 input-tel  ' >
          <Input
            type='text'
            className='ml-3'
            placeholder='输入微信号（选填）'
            value={weiValue}
            onInput={this.onWeiTel}
          />
        </View>
        <View className='mt-3 ml-2 text-small text-secondary' > {LOCALE_FEEDBACK_DETAIL}</View>
        <AtButton className='btn-card mt-5' circle type='primary' onClick={this.onComfire} > {LOCALE_FEEDBACK_COMFIRE} </AtButton>
      </View>


    );
  }
}
export default feedback
