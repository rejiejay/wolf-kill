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
        LIST: ['complete_on_line', 'physical_cards']
    }
}

class ReactComponent extends Component {
    constructor (props) {
        super(props)

        this.state = {
            isCardOpen: false,
            playRole: CONST.PLAY_ROLE.DEFAULT
        }

        this.gameMethod = CONST.GAME_METHOD.DEFAULT

        this.selectPlayRole = React.createRef()
    }

    openCard() {
    }

    hidenCard() {
    }

    intoDark() {
    }

    render() {
        const { isCardOpen, playRole } = this.state

        return <div>
            <CardBackground
                isCardOpen={isCardOpen}
                onClick={this.openCard}
            >
                {isCardOpen && playRole && <PlayRole
                    onClick={this.hidenCard}
                />}
                {isCardOpen && playRole && <IntoDarkBtton
                    onClick={this.intoDark}
                />}
            </CardBackground>

            <SelectPlayRole ref={ref = this.selectPlayRole} />
        </div>
        
    }
}

const render = component => new Promise(resolve => ReactDOM.render(component, document.body, instance => resolve(instance)))
