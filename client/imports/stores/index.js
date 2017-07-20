import Accounts from './domain/Accounts'
import Channels from './domain/Channels'
import Posts from './domain/Posts'
import Reports from './domain/Reports'
import Threads from './domain/Threads'
import Users from './domain/Users'
import Routes from './libs/Routes'
import Drawer from './ui/Drawer'
import Info from './ui/info'
import InputPost from './ui/InputPost'
import Snackbar from './ui/Snackbar'
import Timeline from './ui/Timeline'

const stores = {
  accounts: Accounts.create(),
  drawer: Drawer.create(),
  info: Info.create(),
  inputPost: InputPost.create(),
  channels: Channels.create({publish: 'channels'}),
  posts: Posts.create({publish: 'posts'}),
  reports: Reports.create(),
  snackbar: Snackbar.create(),
  threads: Threads.create({publish: 'threads'}),
  timeline: Timeline.create(),
  users: Users.create()
}

Routes.setStores(stores)

const routes = Routes.create()

Routes.run()

stores.routes = routes

export default stores
