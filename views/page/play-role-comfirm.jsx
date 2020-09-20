import WebSocket from './module/web-socket'
import User from './module/user'

export const PagePlayRoleComfirm = {
    ref: React.createRef(),

    react: <ReactComponent ref={PagePlayRoleComfirm.ref} />,

    init: async function () {
        await render(this.react)
        WebSocket.bind(this.ref)
    }
}

const CONST = {
    PLAY_ROLE: {
        DEFAULT: false,
        LIST: ['Villagers', 'Wlof', 'KingWolf', 'Hunter', 'Predictor', 'Witch', 'Idiot']
    },

    GAME_METHOD: {
        DEFAULT: false,
        LIST: ['complete_on_line', 'physical_cards'],
        PHYSICAL_CARDS: 'physical_cards'
    },

    READLY_START_LIST: {
        DEFAULT: [],
        ITEM_FORMAT: {
            isReady: false,
            name: 'user name',
            numberNo: 'user number no',
        }
    }
}

class ReactComponent extends Component {
    constructor (props) {
        super(props)

        this.state = {
            isCardOpen: false,
            playRole: CONST.PLAY_ROLE.DEFAULT,
            gameMethod: CONST.GAME_METHOD.DEFAULT,
            readlyStartList: CONST.READLY_START_LIST.DEFAULT
        }

        this.selectPlayRole = React.createRef()
        this.cardBackground = React.createRef()
    }

    initPlayRole() {
        const fetchtInstance = await fetch.get('getPlayRole')
        if (fetchtInstance.result !== 1) return alert(fetchtInstance.message)
        const { gameMethod, playRole } = fetchtInstance.data
        this.setState({ gameMethod, playRole })
    }

    WS_Income_GameMethod(gameMethod) {
        this.setState({ gameMethod })
        this.selectGameMethod.hiden()
    }

    WS_Income_ReadlyStartList(readlyStartList) {
        this.setState({ readlyStartList })
    }

    async openCard() {
        const { gameMethod, playRole } = this.state

        if (!gameMethod) {
            await this.cardBackground.animation()
            return this.selectGameMethodHandle()
        }

        if (gameMethod === CONST.GAME_METHOD.PHYSICAL_CARDS && !playRole) {
            await this.cardBackground.animation()
            return this.selectPlayRoleHandle()
        }

        this.setState({ isCardOpen: true })
    }

    selectGameMethodHandle() {
        this.selectGameMethod.open()
    }

    async selectPlayRoleHandle() {
        const selectInstance = await this.selectPlayRole.open()
        if (selectInstance.result !== 1) return 
        this.openCard()
    }

    hidenCard() {
        this.setState({ isCardOpen: false })
    }

    async intoDark() {
        const fetchtInstance = await fetch.post('intoDark')
        if (fetchtInstance.result !== 1) return alert(fetchtInstance.message)

        this.setState({ isCardOpen: false })
        this.confirmStartPopup.open()
    }

    async cancelIntoDarkHandle() {
        const fetchtInstance = await fetch.post('cancelIntoDark')
        if (fetchtInstance.result !== 1) return alert(fetchtInstance.message)

        this.setState({ isCardOpen: false })
        this.confirmStartPopup.hiden()
    }

    render() {
        const { gameMethod, isCardOpen, playRole, readlyStartList } = this.state

        return <div>
            <GameMethodTip 
                gameMethod={gameMethod}
                onClick={() => this.selectGameMethodHandle()}
            />
            {/* CardBackground will same as other.jsx | when it repeat, please abstract it */}
            <CardBackground
                ref={ref = this.cardBackground}
                isCardOpen={isCardOpen}
                onClick={this.openCard}
            >
                {isCardOpen && playRole && <PlayRole name={playRole} onClick={this.hidenCard}/>}
                {isCardOpen && playRole && <IntoDarkBtton onClick={this.intoDark}/>}
            </CardBackground>

            <SelectPlayRole ref={ref = this.selectPlayRole} />
            <SelectGameMethod ref={ref = this.selectGameMethod} />

            {/* is same as readly-comfirm.jsx | please abstract it */}
            <ConfirmStartPopup
                ref={ref = this.confirmStartPopup}
                readlyStartList={readlyStartList}
                cancel={this.cancelIntoDark}
            />
        </div>
    }
}

const render = component => new Promise(resolve => ReactDOM.render(component, document.body, instance => resolve(instance)))
