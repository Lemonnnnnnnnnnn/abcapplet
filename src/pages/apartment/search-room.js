/* eslint-disable react/jsx-indent-props */
import Taro, { Component } from '@tarojs/taro'
import { View, Input, Button } from '@tarojs/components'
import { AtButton, AtInput, AtIcon } from 'taro-ui'
import RoomItem from '@components/room-item'
import { COLOR_GREY_2, COLOR_GREY_0 } from '@constants/styles'

// Redux相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'
import * as apartmentActions from '@actions/apartment'


@connect(state => state, {
    ...userActions,
    ...apartmentActions,
})
class ApartmentSearchRoom extends Component {
    config = {
        navigationBarTitleText: '搜索房间',
    }
    state = {
        roomList: [],
        inputValue: "",
        matchRoomList: [],
    }

    async componentDidMount() {
        const { id } = this.$router.params

        const { data: { data } } = await this.props.dispatchHouseTypeShow({ id })

        this.setState({
            roomList: data.room_list,
            matchRoomList: data.room_list,
            isSign: data.is_sign,
        })

    }

    onHandleInput(e) {
        this.setState({ inputValue: e.detail.value })
    }

    onSearch() {
        const { inputValue, roomList } = this.state
        let matchRoomList = []
        roomList.map(i => {
            if (i.no === inputValue) {
                matchRoomList.push(i)
            }
        })
        this.setState({ matchRoomList: matchRoomList })

    }

    render() {
        const { isSign, inputValue, matchRoomList } = this.state

        return (
            <View style={{ background: "#fff" }}>
                <View className='at-row at-row__justify--center  '>
                    <View className='search-box at-row  at-row__align--center at-col-8 '>
                        <AtIcon className='ml-3 at-row' value='search' size={15} color={COLOR_GREY_0} />
                        <Input placeholder='请输入您要查找的房间号' onInput={this.onHandleInput} className='ml-3 at-row text-normal' ></Input>
                    </View>
                    <View onClick={this.onSearch} className='at-row at-col-3  at-row__align--center at-row__justify--center  ml-2  search-box text-normal  '>
                        搜索
                    </View>
                </View>
                <View className='mt-2'>
                    {matchRoomList.length ? matchRoomList.map((i, index) =>
                        <RoomItem
                            key={i.id}
                            room={i}
                            roomList={matchRoomList}
                            isSign={isSign}
                            className={`${index + 1 !== matchRoomList.length && 'border-bottom'} pt-1 pl-3 pr-3`}
                        />) :
                        <View className='text-secondary mt-2 mb-2' style={{ textAlign: "center" }}>您所搜索的房间不存在</View>
                    }

                </View>
            </View>
        )
    }
}


export default ApartmentSearchRoom
