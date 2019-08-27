// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { AtButton } from 'taro-ui'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as riskActions from '@actions/risk'

// 自定义组件
import Board from '@components/board'
import Decorate from '@components/decorate'
import TabBarBoard from '@components/tab-bar-board'
import ImageUpload from '@components/image-upload';

// 自定义变量相关
import {
  LOCALE_MOBILE,
  LOCALE_SEMICOLON,
  LOCALE_SIGN_TIME,
  LOCALE_APPLY_USER,
  LOCALE_OFF_APARTMENT,
  LOCALE_APPLY_CONFRIM,
  LOCALE_OFF_APARTMENT_IMAGE,
} from '@constants/locale'

@connect(state => state, {
  ...riskActions,
})
class RiskCreate extends Component {
  config = {
    navigationBarTitleText: '申请赔付',
    navigationBarBackgroundColor: '#FFC919',
  }

  state = {
    risk: {
      apartment_title: '',
      room_no: '',
      sign_time: '',
    },
    payload: {
      order_id: 0,
      name: '',
      mobile: '',
      img: [],
      // reason: '',
    },
  }

  componentDidMount() {
    const { id } = this.$router.params
    const { payload } = this.state
    const { risks } = this.props

    this.setState({
      risk: risks.list.find(i => i.id == id),
      payload: { ...payload, order_id: id }
    })
  }

  onChangeImage(files) {
    const { payload } = this.state
    this.setState({ payload: { ...payload, img: files } })
  }

  onNameInput({ currentTarget: { value } }) {
    const { payload } = this.state
    this.setState({ payload: { ...payload, name: value } })
  }

  onMobileInput({ currentTarget: { value } }) {
    const { payload } = this.state
    this.setState({ payload: { ...payload, mobile: value } })
  }

  // onReasonInput({ currentTarget: { value } }) {
  //   const { payload } = this.state
  //   this.setState({ payload: { ...payload, reason: value } })
  // }

  onCheckPayload() {
    const { payload } = this.state
    const { order_id, name, mobile, img, reason } = payload

    if (order_id === 0 || name === '' || mobile === '' || reason === '' || img.length === 0) {
      Taro.showToast({
        icon: 'none',
        title: '亲，请检查您填写的内容是否正确',
      })
      return false
    }
    return true
  }

  onRiskCreate() {
    const { payload } = this.state
    this.onCheckPayload()
      && this.props.dispatchRiskCreate(payload)
        .then(() => Taro.navigateBack())
  }

  render() {
    const { risk, payload } = this.state
    const {
      room_no: roomNo,
      sign_time: signTime,
      risk_price: riskPrice,
      apartment_title: apartmentTitle,
    } = risk
    const { name, mobile } = payload

    return (
      <View>
        {/* 背景底色 */}
        <Decorate height='180' />

        <View>
          <Board className='p-3 m-3'>

            {/* 头部 */}
            <View className='at-row at-row__align--center'>
              <View className='text-super'>{LOCALE_OFF_APARTMENT}</View>
              <View className='border-decorate border-decorate-yellow mx-2' style={{ height: '30px' }}></View>
              <View >
                <View className='text-normal'>{apartmentTitle}{roomNo}</View>
                <View className='text-small text-secondary'>{LOCALE_SIGN_TIME}{LOCALE_SEMICOLON}{signTime}</View>
              </View>
            </View>

            {/* 表单 */}
            <View className='at-row mt-3'>
              <View className='at-col-4 pr-2'>
                <View className='text-normal text-bold mb-2'>{LOCALE_APPLY_USER}</View>
                <View>
                  <Input className='risk-input' value={name} onInput={this.onNameInput} />
                </View>
              </View>
              <View className='at-col-8'>
                <View className='text-normal text-bold mb-2'>{LOCALE_MOBILE}</View>
                <View>
                  <Input className='risk-input' value={mobile} onInput={this.onMobileInput} />
                </View>
              </View>
            </View>

            {/* 退租原因 */}
            {/* <View className='mt-3'>
              <View className='text-normal text-bold mb-2'>{LOCALE_RISK_REASON}</View>
              <View className='at-row'>
                <View className='at-col-12'>
                  <Input className='risk-input' value={reason} onInput={this.onReasonInput} />
                </View>
              </View>
            </View> */}

            {/* 图片 */}
            <View className='mt-3'>
              <View className='text-normal text-bold mb-2'>{LOCALE_OFF_APARTMENT_IMAGE}</View>
              <ImageUpload
                onChange={this.onChangeImage}
                text='上传证明'
              />
            </View>

            {/* 文本说明 */}
            <View className='mt-3'>
              <View className='text-normal text-secondary mb-2'>退租审核流程：预计24小时内受理完成</View>
              <View className='text-small text-secondary'>1.受到退租申请及信息凭证，凭证要求：租房合同及其作废证明、身份证照片等。</View>
              <View className='text-small text-secondary'>2.客服审核申请，预计3个工作日。</View>
              <View className='text-small text-secondary'>3.审核通过则进入赔付流程，风险金预计1-3个工作日内到账。</View>
            </View>
          </Board>
        </View>

        <TabBarBoard>
          <View className='at-row'>
            <View className='at-col-6 text-normal at-row at-row__align--center at-row__justify--center'>
              <View>
                风险金赔付金额 {riskPrice}
              </View>
            </View>
            <View className='at-col-6'>
              <View className='px-2'>
                <AtButton
                  circle
                  className='btn-yellow active'
                  onClick={this.onRiskCreate}
                >{LOCALE_APPLY_CONFRIM}</AtButton>
              </View>
            </View>
          </View>
        </TabBarBoard>
      </View>
    )
  }
}

export default RiskCreate
