import { OPTSCHANGES, OPTSGOODSLOAD } from '../constants/opts'

const INITIAL_STATE = {
  categoryList: [
    {
      optName: '精选',
      optId: -1,
      page: 0,
      list: []
    },
    {
      optId: -12,
      optName: '肉单',
      page: 0,
      list: []
    },
    {
      optId: -11,
      optName: '清仓',
      page: 0,
      list: []
    },
    {
      optId: 15,
      optName: '百货',
      page: 0,
      list: []
    },
    {
      optId: 4,
      optName: '母婴',
      page: 0,
      list: []
    },
    {
      optId: 1,
      optName: '食品',
      page: 0,
      list: []
    },
    {
      optId: 14,
      optName: '女装',
      page: 0,
      list: []
    },
    {
      optId: 18,
      optName: '电器',
      page: 0,
      list: []
    },
    {
      optId: 1281,
      optName: '鞋包',
      page: 0,
      list: []
    },
    {
      optId: 1282,
      optName: '内衣',
      page: 0,
      list: []
    },
    {
      optId: 16,
      optName: '美妆',
      page: 0,
      list: []
    },
    {
      optId: 743,
      optName: '男装',
      page: 0,
      list: []
    },
    {
      optId: 12,
      optName: '水果',
      page: 0,
      list: []
    },
    {
      optId: 818,
      optName: '家纺',
      page: 0,
      list: []
    },
    {
      optId: 2478,
      optName: '文具',
      page: 0,
      list: []
    },
    {
      optId: 1451,
      optName: '运动',
      page: 0,
      list: []
    },
    {
      optId: 590,
      optName: '虚拟',
      page: 0,
      list: []
    },
    {
      optId: 2048,
      optName: '汽车',
      page: 0,
      list: []
    },
    {
      optId: 1917,
      optName: '家装',
      page: 0,
      list: []
    },
    {
      optId: 2974,
      optName: '家具',
      page: 0,
      list: []
    },
    {
      optId: 3279,
      optName: '医药',
      page: 0,
      list: []
    }
  ],
  activeTab: 0
}

export default function opts (state = INITIAL_STATE, action) {
  switch (action.type) {
    case OPTSCHANGES:
      return {
        ...state,
        activeTab: action.payload
      }
    case OPTSGOODSLOAD:
      var newList = state.categoryList.slice()
      newList[action.payload.index].page = action.payload.page
      if (action.payload.page > 1) {
        newList[action.payload.index].list = newList[action.payload.index].list.concat(action.payload.goods_list)
      } else {
        newList[action.payload.index].list = action.payload.goods_list
      }
      return {
        ...state,
        categoryList: newList
      }
    default:
      return state
  }
}
