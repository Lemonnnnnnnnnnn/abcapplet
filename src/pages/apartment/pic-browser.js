import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import { AtIcon, AtButton } from 'taro-ui'
import {
    TYPE_FAVORITE_ROOM,
} from '@constants/room'

// 自定义常量
import {
    COLOR_YELLOW
} from '@constants/styles'



export default class PicBrowser extends Component {

    config = {
        navigationBarTitleText: '照片浏览',
        navigationBarBackgroundColor: '#000',
        navigationBarTextStyle: 'white'
    }

    state = {
        isCollect : 0,
        hasIsCollect  : false,
        type : '',
    }

    componentWillMount() {
        const { isCollect = 0, hasIsCollect = false, type = ''  } = this.$router.params
        console.log(isCollect,hasIsCollect,type)
        this.setState({
            isCollect : isCollect,
            hasIsCollect  : hasIsCollect,
            type : type
        })
    }

    // onCreateFavorite() {
    //     const id = {}

    //     this.props.onCreateFavorite({ payload: { room_id: id } })
    // }

    // onDeleteFavorite() {
    //     const { room } = this.props
    //     const id = room.room_id || room.id

    //     this.props.onDeleteFavorite({ payload: { room_id: id } })
    // }

    render() {
        const {isCollect , hasIsCollect , type} = this.state
        return (
            <View>
                <View>Image</View>
                <View>
                    <View>Bar</View>
                    <View>

                    </View>
                    <View>
                        {/* 爱心按钮*/}
                        {hasIsCollect
                            ? (!isCollect
                                ? <AtIcon value='heart' size='25' color={COLOR_YELLOW} onClick={this.onCreateFavorite} />
                                : <AtIcon value='heart-2' size='25' color={COLOR_YELLOW} onClick={this.onDeleteFavorite} />
                            )
                            : (type === TYPE_FAVORITE_ROOM && <AtIcon value='heart-2' size='25' color={COLOR_YELLOW} onClick={this.onDeleteFavorite} />)
                        }
                    </View>
                </View>
            </View>
        );
    }
}