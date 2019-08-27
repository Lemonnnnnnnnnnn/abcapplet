// Taro 相关
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

// 自定义组件
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'

// 自定义常量
import { COLOR_GREY_2 } from '@constants/styles'
import { API_UPLOAD_IMAGE } from '@constants/api'

class ImageUpload extends BaseComponent {
  static defaultProps = {
    placeholer: 6,
  }

  state = {
    index: 0,
    files: [],
    picArr: [],
  }

  componentDidMount() {
    const { placeholer } = this.props
    const files = Array.from({ length: placeholer - 1 }).map((i, key) => ({
      id: key,
      url: '',
    }))
    this.setState({ files })
  }

  async onClick() {
    let { files, index, picArr } = this.state
    const { placeholer } = this.props
    let picArrNew = []

    let picArrClone = JSON.parse(JSON.stringify(picArr))
    picArrClone = []
    let indexClone = JSON.parse(JSON.stringify(index))
    let filesClone = JSON.parse(JSON.stringify(files))

    await Taro.chooseImage({
      count: placeholer - 1,
      sizeType: ['compressed'],
      success: (res) => {
        if (indexClone <= placeholer - 1) {
          picArrNew = picArrClone.concat(res.tempFilePaths)
          this.setState({ picArr: picArrNew })
          Taro.showLoading({ title: '正在上传照片' })
        }
      }
    })

    for (let i = 0; i < picArrNew.length; i++) {
      if (index >= placeholer - 1) {
        Taro.showToast({
          title: '上传图片数量达到限制',
          icon: 'none'
        })
        return;
      }

      await Taro.uploadFile({
        name: 'risk',
        url: API_UPLOAD_IMAGE,
        filePath: picArrNew[i],

        success: (res) => {
          if (indexClone <= placeholer - 1) {
            Taro.showLoading({ title: '正在上传照片' })
          }
          const file = (JSON.parse(res.data)).data[0]
          filesClone[indexClone] = {
            files: filesClone[indexClone],
            url: file.path,
          }
          indexClone += 1
          this.setState({ files: filesClone, index: indexClone })
        },

        complete: () => {
          if (indexClone > 5) {
            Taro.hideLoading()
            Taro.showToast({
              title: '上传图片数量达到限制',
              icon: 'none'
            })
            return
          } else if (indexClone === picArrNew.length) {
            Taro.hideLoading()
            return
          }
        }
      })
      const picJsonArr = JSON.stringify(filesClone.filter(i => i.url !== '').map(i => i.url))
      this.props.onChange(picJsonArr)
    }
  }

  render() {
    const { files } = this.state
    return (
      <View className='at-row at-row--wrap'>
        <View className='at-col at-col-4' onClick={this.onClick}>
          <View className='upload-image-item at-row at-row__align--center at-row__justify--center'>
            <View>
              <View className='at-row at-row__justify--center'>
                <ABCIcon icon='add' color={COLOR_GREY_2} size='32' />
              </View>
              <View className='text-normal text-secondary mt-2'>上传证明</View>
            </View>
          </View>
        </View>
        {
          files.map(i =>
            <View key={i.id} className='at-col at-col-4'>
              <View className='upload-image-item at-row at-row__align--center at-row__justify--center'>
                <Image src={i.url} style={{ width: '80%', height: '80%' }} />
              </View>
            </View>
          )
        }
      </View >
    )
  }
}

export default ImageUpload
