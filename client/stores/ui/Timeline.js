import { types } from 'mobx-state-tree'

export default types.model('Timeline', {
  name: types.maybe(types.string),
  channelId: types.maybe(types.string),
  unique: types.maybe(types.string)
}, {
  setCurrent ({channelId = null, unique = '', name = ''}) {
    switch (unique) {
      case 'self':
        this.name = '自分の書き込み'
        break
      case 'follows':
        this.name = 'ユーザの書き込み'
        break
      default:
        this.name = '全ての書き込み'
        break
    }
    this.name = name
    this.channelId = channelId
    this.unique = unique
  }
})