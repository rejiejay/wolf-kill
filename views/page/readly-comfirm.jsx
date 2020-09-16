import WebSocket from './module/web-socket'
import User from './module/user'

export const PageReadlyComfirm = {
    ref: React.createRef(),

    react: <ReactComponent ref={PageReadlyComfirm.ref} />,

    init: async function () {
        await render(this.react)
        WebSocket.bind(this.ref)
    }
}

class ReactComponent extends Component {
    constructor (props) {
        super(props)

        this.state = {
            myReadlyStatus: 'isReady',
            otherUserList: [
                // {
                //     readlyStatus: 'isReady',
                //     userName,
                //     userNo,
                // }
            ]
        }

        this.confirmStartPopup = React.createRef()
    }

    initAllUserReadlyStatus() {
        const fetchtInstance = await fetch.get('allUserReadlyStatus')
        if (fetchtInstance.result !== 1) return alert(fetchtInstance.message)
        const allUserReadlyStatus = fetchtInstance.data
        const { myReadlyStatus, otherUserList } = allUserSeparation({ myUserName: User.name, allUserReadlyStatus })
        this.setState({ myReadlyStatus, otherUserList })
    }

    WS_Income_OtherUserList(otherUserList = []) {
        this.setState({ otherUserList })
    }

    WS_Income_AllReadlyForStart() {
        this.confirmStartPopup.startCountDown()
    }

    WS_Income_CancelReadlyStart() {
        this.confirmStartPopup.cancelCountDown()
    }

    readlyHandle() {
        const { myReadlyStatus, otherUserList } = this.state
        const switchReadlyStatus = myReadlyStatus === 'isReady' ? 'unReady' : 'isReady'

        const repeatInstance = isRepeat({ userNameAndNumberNo: User, otherUserList })
        if (repeatInstance.result === 1) return popOut(repeatInstance.message)
        .then(this.changeMyNameAndNumberNo)

        const fetchtInstance = await fetch.post('updataUserReadlyStatus')
        if (fetchtInstance.result !== 1) return alert(fetchtInstance.message)

        this.setState({ myReadlyStatus: switchReadlyStatus })
    }

    cancelStartHandle() {
        const fetchtInstance = await fetch.post('cancelReadlyStart')
        if (fetchtInstance.result !== 1) return alert(fetchtInstance.message)
    }

    changeMyNameAndNumberNo() {
        const defaultNumberNo = User.numberNo
        const defaultName = User.name

        // 复用 start.jsx 逻辑
    }

    render() {
        const { myReadlyStatus, otherUserList } = this.state

        return <div>
            <WolfTitle
                title={myReadlyStatus === 'unReady' ? '准备开始' : '等待加入'}
                userInforChange={this.changeMyNameAndNumberNo}
            />
            <MyReadlyStatus 
                isReadly={myReadlyStatus === 'isReady'} 
                userInforChange={this.changeMyNameAndNumberNo}
            />
            <OtherUserReadlyStatus userInfor={otherUserList} />
            <ReadlyButton
                onClick={this.readlyHandle}
            >{ myReadlyStatus === 'unReady' ? '准备' : '取消准备'}</ReadlyButton>
            <StartConfirmPopup 
                ref={ref = this.confirmStartPopup}
                cancel={this.cancelStartHandle}
            />
        </div>
    }
}

const render = component => new Promise(resolve => ReactDOM.render(component, document.body, instance => resolve(instance)))
