import WebSocket from './module/web-socket'
import User from './module/user'
import render from './components/render'

export const PageInDark = {
    ref: React.createRef(),

    react: <ReactComponent ref={PageInDark.ref} />,

    init: async function () {
        await render(this.react)
        WebSocket.bind(this.ref)
    }
}

const CONST = {
    ROLE_PART_NAME: {
        LIST: ['Villagers', 'Wlof', 'KingWolf', 'Hunter', 'Predictor', 'Witch', 'Idiot']
    },

    ROLE_PART: {
        NAME: {
            DEFAULT: 'Villagers',
            LIST: CONST.ROLE_PART_NAME.LIST
        }
    },

    PLAY_STATUS: {
        DEFAULT: 'active',
        ACTIVE: 'active',
        DEATH: 'death'
    },

    ROUND_STATUS: {
        ACTIVE: 'active',
        DEATH: 'death',
        POISON: 'poison'
    },
}

class ReactComponent extends Component {
    constructor (props) {
        super(props)

        this.state = {
            canCardOpen: false
        }
        this.card = React.createRef()
        this.wlofKillSelected = React.createRef()
        this.predictorSelected = React.createRef()
        this.witchSelected = React.createRef()
    }

    WS_Income_RoundStart({ actionRoleNames }) {
        if (!actionRoleNames.includes(User.playRole.name)) return

        this.setState({ canCardOpen: true }, this.openCard)

        const actionHandle = this[`${User.playRole.name}ActionHandle`]
        actionHandle()
    }

    WS_Income_RoundEnd() {
        this.setState({ canCardOpen: false }, this.hidenCard)
    }

    openCard() {
        const { canCardOpen } = this.state

        if (!canCardOpen) return alert('is not you round trun')
        this.card.open()
    }

    hidenCard() {
        this.card.hiden()
    }

    async WlofActionHandle() {
        if (User.playStatus === CONST.PLAY_STATUS.DEATH) return tipConfirm('Please select what wlof want to kill')
        .then(() => fetch.hidenCard())

        const killSelected = await this.wlofKillSelected.show()
        fetch.post('EndWlofRound', killSelected)
    }

    async PredictorActionHandle() {
        if (User.playStatus === CONST.PLAY_STATUS.DEATH) return tipConfirm('you are out of game')
        .then(() => fetch.post('EndPredictorRound'))

        const selectedResult = await this.predictorSelected.show()
        fetch.post('EndWlofRound', selectedResult)
    }

    async HunterActionHandle() {
        if (User.playStatus === CONST.PLAY_STATUS.DEATH) return tipConfirm('you are out of game')
        .then(() => fetch.post('EndHunterRound'))

        const hunterPlayStatusInstance = await fetch.get('getHunterPlayStatus')
        if (hunterPlayStatusInstance.result !== 1) return this.reGetConfirm(this.HunterActionHandle)
        const hunterPlayStatus = hunterPlayStatusInstance.data

        if (hunterPlayStatus === CONST.ROUND_STATUS.ACTIVE) return tipConfirm('you are active of this round')
        .then(() => fetch.post('EndHunterRound'))

        if (hunterPlayStatus === CONST.ROUND_STATUS.POISON) return tipConfirm('you are death  of this round which is poison by witch, and you can`t do anything')
        .then(() => fetch.post('EndHunterRound'))

        await tipConfirm('you are death of this round which is kill by wolf, and you can activate skills when in daytime')

        const isConfirm = await selectedConfirm('Do you want to activate skills: Show everyone the identity of a hunter and selected shoot kill one person')

        if (!isConfirm) return fetch.post('EndHunterRound')

        fetch.post('HunterSkillActivate')
    }

    async WitchActionHandle() {
        if (User.playStatus === CONST.PLAY_STATUS.DEATH) return tipConfirm('you are out of game')
        .then(() => fetch.post('EndWitchRound'))

        const selectedResult = await this.predictorSelected.show()
        fetch.post('EndWitchRound', selectedResult)
    }

    render() {
        const { canCardOpen } = this.state

        return <div>
            {/* CardBackground will same as other.jsx | when it repeat, please abstract it */}
            <Card
                ref={ref = this.card}
                canCardOpen={canCardOpen}
                onClick={this.openCard}
            >
                <PlayRole roleInfor={User.playRole} onClick={this.hidenCard}/>
            </Card>

            <WlofKillSelected ref={ref = this.wlofKillSelected} />
            <PredictorSelected ref={ref = this.predictorSelected} />
            <WitchSelected ref={ref = this.witchSelected} />
        </div>
    }
}
