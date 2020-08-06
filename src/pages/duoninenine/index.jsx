import React, { Component } from 'react'
import { View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import fetch from '../../utils/request'
import { API_RECOMMEND_GOODS } from '../../constants/api'
import Goods from "../../components/goods"
import bannerImg from './one_nine_banner_v2.png'
import './index.scss'

class Index extends Component {
  constructor (props) {
    super(props)
    this.state = {
      list: [],
      page: 0,
      limit: 50,
      isBottom: false
    }
  }
  handleLoad() {
    if (this.isBottom) {
      return
    }
    return fetch({
      url: API_RECOMMEND_GOODS,
      payload: {
        offset: this.state.page * this.state.limit,
        isunion: 1,
        limit: this.state.limit,
        channel_type: 0
      }
    })
      .then(res => {
        this.setState({
          page: this.state.page + 1,
          isBottom: res.goods_list.length < this.state.limit,
          list: this.state.page > 0 ? this.state.list.concat(res.goods_list) : res.goods_list
        })
        return res
      })
  }
  componentWillMount() {
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  }
  onShareAppMessage() {
    return {
      title: '限时特惠，好货只要1.9',
      desc: '一多宝,只为让你省钱',
    }
  }
  onShareTimeline() {
    return {
      title: '限时特惠，好货只要1.9',
      desc: '一多宝,只为让你省钱',
    }
  }
  render() {
    return (
      <View className='index'>
        <Goods
          renderHeadComment={<Image className='banner-img' src={bannerImg} />}
          list={this.state.list}
          onInit={this.handleLoad.bind(this)}
        />
      </View>
    )
  }
}

export default Index
