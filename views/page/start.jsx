import WebSocket from './module/web-socket'
import User from './module/user'

export const PageStart = {
    ref: React.createRef(),

    react: <ReactComponent ref={PageStart.ref} />,
    
    init: async function () {
        await render(this.react)
        WebSocket.bind(this.ref)
    }
}

class ReactComponent extends Component {
    constructor (props) {
        super(props)

        this.state = {
        }

        this.numberNoList = []
        this.nameList = []
    }

    getNumberNoAndNameList() {
        const fetchtInstance = await fetch.get('getNumberNoAndNameList')
        if (fetchtInstance.result !== 1) return alert(fetchtInstance.message)

        const fetchtData = fetchtInstance.data
        this.numberNoList = fetchtData.numberNoList
        this.nameList = fetchtData.nameList
    }

    WS_Income_Start_NumberNoList(numberNoList = []) {
        this.numberNoList = numberNoList
    }

    WS_Income_Start_NumberNoList(nameList = []) {
        this.nameList = nameList
    }

    startGame() {
        const defaultNumberNo = createNumberNo(this.numberNoList)
        const defaultName = createName(this.nameList)

        const inputPopUp = ({ numberNo, name }) => popUp({ numberNo, name })
        .then(inputHandle)

        const inputHandle = async ({ numberNo, name }) => {
            const repeatInstance = isRepeat({ numberNo, name })
            if (repeatInstance.result !== 1) return alert(`${repeatInstance.message} 是重复的`).then(inputPopUp({ numberNo, name }))

            const fetchtInstance = await fetch.post({ numberNo, name })
            if (fetchtInstance.result !== 1) return alert(fetchtInstance.message).then(inputPopUp({ numberNo, name }))

            User.initUserInfor({ numberNo, name })
            PageReadlyComfirm.init()
        }

        inputPopUp({ defaultNumberNo, defaultName })
    }

    render() {
        return <div>
            <WolfTitle>wolf kill</WolfTitle>
            <Button
                onClick={this.startGame}
            >start game</Button>
        </div>
    }
}

const render = component => new Promise(resolve => ReactDOM.render(component, document.body, instance => resolve(instance)))

export const PageRelink = {
    init: () => {}
}
