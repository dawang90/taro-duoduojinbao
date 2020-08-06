import {
  OPTSCHANGES,
  OPTSGOODSLOAD
} from '../constants/opts'
import { createAction } from '../utils/redux'
import { API_GOODS_LIST } from "../constants/api";

export const optsChange = (index) => {
  return {
    type: OPTSCHANGES,
    payload: index
  }
}

export const dispatchOptsGoods = (payload, index) => createAction({
  url: API_GOODS_LIST,
  type: OPTSGOODSLOAD,
  cb: res => ({...res, index, page: payload.page}),
  payload,
})
