import User from './module/user'
import { getUserInfor } from './service'
import WebSocket from './module/web-socket'
import { PageStart, PageRelink } from './page/start'

init = () => {
    userInfor = getUserInfor()
    User.init(userInfor)
    WebSocket.init(userInfor)

    if (userInfor && userInfor.status !== 'start') return PageRelink.init()
    PageStart.init()
}
