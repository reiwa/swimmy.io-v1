import { Meteor } from 'meteor/meteor'
import { types } from 'mobx-state-tree'
import { createModel, Observer } from '/client/packages/Sub'
import Post from '/lib/models/Post'

const CustomObserver = types.compose('Observer', Observer, {}, {
  addedAfter () {
    this.index = this.index.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
})

export default types.model('Posts', {
  model: createModel(Post, CustomObserver),
  one: types.maybe(Post),
  findOne (selector, options) {
    return new Promise((resolve, reject) => {
      Meteor.call('posts.findOne', selector, options, (err, res) => {
        if (err) { reject(err) } else {
          try {
            this.setOne(res)
          } catch (e) {
            console.log(e)
          }
          resolve(res)
        }
      })
    })
  },
  insert (req) {
    return new Promise((resolve, reject) => {
      Meteor.call('posts.insert', req, (err, res) => {
        if (err) { reject(err) } else { resolve(res) }
      })
    })
  },
  remove (_id) {
    return new Promise((resolve, reject) => {
      Meteor.call('posts.insert', {_id}, (err, res) => {
        if (err) { reject(err) } else { resolve(res) }
      })
    })
  },
  updateReaction (postId, name) {
    return new Promise((resolve, reject) => {
      Meteor.call('posts.updateReaction', {
        postId,
        name
      }, (err, res) => {
        if (err) { reject(err) } else { resolve(res) }
      })
    })
  }
}, {
  setOne (model) {
    this.one = model
  }
})
