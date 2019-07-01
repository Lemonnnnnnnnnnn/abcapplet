// Taro 相关
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import { View } from '@tarojs/components'

// NPM 包
import classNames from 'classnames'

// 自定义组件
import Board from '@components/board'
import BaseComponent from '@components/base'
import RiskSteps from '@components/risk-steps'

// 自定变量
import {
  LOCALE_CAN_APPLY,
  LOCALE_APPLY_RISK,
  LOCALE_WILL_COST_RISK,
} from '@constants/locale'

import {
  RISK_SUCCESS_STATUS_STEP,
  RISK_FAIL_STATUS_STEP,
} from '@constants/risk'

import {
  PAGE_RISK_CREATE
} from '@constants/page'

class RiskItem extends BaseComponent {
  static defaultProps = {
    risk: {
      apartment_title: '',
      id: 0,
      reason: null,
      risk_price: "",
      room_no: "",
      sign_time: "",
      status: 0,
      time: ""
    }
  }

  onNavigation() {
    const { risk } = this.props
    const { id } = risk
    return Taro.navigateTo({ url: `${PAGE_RISK_CREATE}?id=${id}` })
  }

  render() {
    const { risk, className } = this.props
    const {
      time,
      room_no: roomNo,
      risk_price: riskPrice,
      apartment_title: apartmentTitle,
    } = risk

    const status = parseInt(risk.status)
    const current = status != 4 ? status : status - 1
    const steps = (status != 4 ? RISK_SUCCESS_STATUS_STEP : RISK_FAIL_STATUS_STEP) || []

    return (
      <Board className={classNames('px-3 py-2', className)}>
        {/* 头部 */}
        <View className='at-row at-row__align--start'>
          <View class='border-decorate border-decorate-yellow' style={{ height: '18px' }} />
          <View className='ml-2'>
            <View className='text-normal'>{apartmentTitle}{roomNo}</View>
            <View className='text-secondary text-small mt-1'>{time}{LOCALE_CAN_APPLY}</View>
          </View>
        </View>

        {/* 进度条 */}
        <RiskSteps
          className='mt-3'
          items={steps}
          current={current}
        />

        {/* 说明 */}
        <View className='at-row at-row__justify--center'>
          <View className='text-yellow text-small my-2'>{LOCALE_WILL_COST_RISK}{riskPrice}</View>
        </View>

        <View className='at-row at-row__justify--center'>
          <AtButton
            circle
            size='small'
            className='btn-yellow active px-4'
            onClick={this.onNavigation}
          >{LOCALE_APPLY_RISK}</AtButton>
        </View>
      </Board >
    )
  }
}

export default RiskItem
