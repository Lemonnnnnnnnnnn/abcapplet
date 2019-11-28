import Taro, { Component } from '@tarojs/taro'
import { View, Input, ScrollView } from '@tarojs/components'
import { AtTag } from 'taro-ui'
import classNames from 'classnames'

import BaseComponent from '@components/base'


class Index extends BaseComponent {

  config = {
    navigationBarTitleText: ''
  }

  state = {


  }

  componentWillMount() { }
  componentDidMount() { }

  render() {
    const { NightList, cbdList } = this.props
    return (
      <View className=' '>
        <View className='at-col-3'>
          <View style={{ width: Taro.pxTransform(185) }}>
            <View className='button-chart mt-3 text-normal at-row at-row__align--center at-row__justify--between'>
              <View
                onClick={this.props.onNightListChange.bind(this, 1)}
                className={classNames('px-2', { 'button-chart--active': NightList })}
              >整租</View>
              <View
                onClick={this.props.onNightListChange.bind(this, 2)}
                className={classNames('px-2', { 'button-chart--active': !NightList })}
              >合租</View>
            </View>
          </View>
        </View>
        <View className=' '>

          <View className='mt-3'>
            <ScrollView
              scrollX

              style='width:90vw'
            >
              <View className='at-row'>
                {cbdList && cbdList.map((i, index) =>
                  <View key={i.id}>
                    {index === 0 ? i.active ? <View className='page-middile  px-2 page-fac ' style={{ border: '1px  solid #fcc91f' }} onClick={this.props.onChangeCbd.bind(this, i)} >
                      <View className='text-small text-yellow'>{i.name}</View>
                    </View>
                      :
                      <View className='page-middile  px-2 page-fac ' onClick={this.props.onChangeCbd.bind(this, i)} >
                        <View className='text-small text-secondary '>{i.name}</View>
                      </View> :

                      i.active ? <View className='page-middile  px-2 page-fac ml-1' style={{ border: '1px  solid #fcc91f' }} onClick={this.props.onChangeCbd.bind(this, i)} >
                        <View className='text-small text-yellow'>{i.name}</View>
                      </View>
                        :
                        <View className='page-middile  px-2 page-fac ml-1' onClick={this.props.onChangeCbd.bind(this, i)} >
                          <View className='text-small text-secondary '>{i.name}</View>
                        </View>}


                  </View>
                )}

              </View>

            </ScrollView>
          </View>


        </View>

      </View>
    );
  }
}
export default Index;
