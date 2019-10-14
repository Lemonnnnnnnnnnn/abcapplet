# ABC 公寓

## 简介

| 名称 | 说明 |
| --- | --- |
| 框架 | [taro](https://taro.aotu.io/) |
| 基础 UI | [taro-ui](https://taro-ui.aotu.io/) |

## 项目结构

### 概览

| 路径 | 说明 |
| --- | --- |
| src/app.js | 项目入口文件 |
| src/config | 全局基本配置 |
| src/components | 全局组件目录 |
| src/pages | 小程序页面目录 |
| src/assets | 图片资源目录 |
| src/constants | redux 和 项目常量目录 |
| src/styles | 样式文件目录 |

### Redex 相关

| 路径 | 说明 |
| --- | --- |
| src/store | redux store |
| src/actions | redux actions |
| src/reducers | redux reducers |
| src/constants | redux constants |

### Constants 相关

| 路径 | 说明 |
| --- | --- |
| src/constants/api.js | 接口相关配置 |
| src/constants/styles.js | 内嵌样式相关配置 |
| src/constants/message.js | 文本配置（多语言预备方案） |

### Utils 相关

| 路径 | 说明 |
| --- | --- |
| request | 封装了基础的网络请求 |
| redux | 封装了 request 中的请求为 actions |

## 版本相关

### v1.5.0

| 所属项目 | 原型 | 设计稿 | 接口 |
| --- | --- | --- | --- |
| 客户端 | [原型](https://org.modao.cc/app/4a1e4adbf1c09a643a36bd33e405bf0b#screen=s917C0C19BC1553657488628) | [设计稿](https://lanhuapp.com/web/#/item/project/board?pid=7e6a33f5-4c50-4c7b-82f3-5a03a89dc231) | [接口](https://www.showdoc.cc/369994834935035) |
| 管家端 | [原型](https://org.modao.cc/app/460f7b2ae4ebb69e1cb7ee6977dd57c954ef1176#screen=s01DBA570101557387662643) | [设计稿](https://lanhuapp.com/web/#/item/project/board?pid=6765f128-a6c5-42d3-953e-6fa36ccfb66d) | [接口](https://www.showdoc.cc/376825715417871) |
| 销售端 | [原型](https://org.modao.cc/app/629649b0096af0a4b811e64d18818580#screen=s05215505CE1554347900670) | [设计稿](https://lanhuapp.com/web/#/item/project/board?pid=a0dbfaec-c745-4ac2-89b9-d96ce1609b4c) | [接口](https://www.showdoc.cc/379431691870580) |


##  特别说明

### 项目引用 外部的 taro-navigationbar自定义组件

引用详情见链接(https://github.com/lingxiaoyi/Taro-navigation-bar)

在该项目中需要修改 taro-navigationbar/node_modules/index.js和taro-navigationbar/node_modules/index.js

在 taro-navigationbar/node_modules/index.js中，由于Taro框架暂不支持Taro.getMenuButtonBoundingClientRect()的用法，这里需要改为wx.getMenuButtonBoundingClientRect();

在taro-navigationbar/node_modules/index.js,为了整个项目的样式美观
lxy-nav-bar__button 中的font-size改为13PX

返回上一页的图片地址改为(https://images.gongyuabc.com//image/chevron-leftNew.png)
返回首页的图片地址改为(https://images.gongyuabc.com//image/backHome.png)
