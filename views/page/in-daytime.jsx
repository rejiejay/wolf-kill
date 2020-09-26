import WebSocket from './module/web-socket'
import User from './module/user'
import render from './components/render'

export const PageInDayTime = {
    ref: React.createRef(),

    react: <ReactComponent ref={PageInDayTime.ref} />,

    init: async function () {
        await render(this.react)
        WebSocket.bind(this.ref)
    }
}

const CONST = {
    LEADERSHIP_SELECT_STATUS: {
        DEFAULT: [],
        ITEM_FORMAT: {
            voteGetCount: 0,
            voteFor: { name: 'user name', numberNo: 'user number no' },
            isAbandoned: false,
            name: 'user name',
            numberNo: 'user number no'
        }
    },

    LEADERSHIP: {
        DEFAULT: {},
        FORMAT: {
            name: 'user name',
            numberNo: 'user number no'
        }
    }
}

class ReactComponent extends Component {
    constructor (props) {
        super(props)

        this.state = {
            actionNumberNo: null
        }
        this.leadershipInfor = CONST.LEADERSHIP.DEFAULT

        this.card = React.createRef()
        this.leadershipSelected = React.createRef()
        this.roundStartSelected = React.createRef()
        this.kingWolfEffectSelected = React.createRef()
        this.voteEffectSelected = React.createRef()
    }

    async init() {
        const dayTimeStatusInstance = await fetch.get('getDayTimeStatus')
        if (dayTimeStatusInstance.result !== 1) return this.reGetConfirm(this.init)

        const dayTimeStatus = dayTimeStatusInstance.data
        const { isFirstDay, isSecondDay, leadershipInfor, lastNightResult } = dayTimeStatus

        await Modal.confirm(lastNightResult)
        if (isFirstDay) this.leadershipInfor = await this.leadershipSelected.show()
        if (isSecondDay && !leadershipInfor) this.leadershipInfor = await this.leadershipSelected.show()
        this.leadershipInfor = leadershipInfor
        if (leadershipInfor.isBreakOff) return await this.roundStartByRandom()
        if (leadershipInfor.isNotNil && leadershipInfor.isBeKill) await this.leadershipHandOut()
        if (leadershipInfor.numberNo === User.playRole.numberNo) await this.roundStartSelected.show()
    }

    WS_Income_LeadershipSelected({ leadershipSelectStatus = CONST.LEADERSHIP_SELECT_STATUS.DEFAULT }) { 
        this.leadershipSelected.incomeState(leadershipSelectStatus)
    }

    WS_Income_RoundStart({ actionNumberNo }) {
        this.setState({ actionNumberNo })
    }

    WS_Income_RoundVoteSelected() {
        this.voteEffectSelected.show()
    }

    async WS_Income_RoundEnd({ endTip,  }) {
        this.card.hiden()
        if (endTip) await Notification.tip(endTip)
    }

    async WS_Income_IntoDark({ reason }) {
        await Notification.tip(reason)
        this.leadershipSelected.hiden() // For selected
    }

    openCard() {
        const { canCardOpen } = this.state

        if (!canCardOpen) return alert('is not you round trun')
        this.card.open()
    }

    hidenCard() {
        this.card.hiden()
    }

    wlofEffectHandle() {
        const wlofEffectConfirmInstance = await Modal.confirm('Are you sure you want to activate your effect skills')
        if (wlofEffectConfirmInstance.result !== 1) return
        if (User.playRole.name === 'KingWolf') await this.KingWolfEffectSelected.show()
        const fetchtInstance = await fetch.post('WlofEffectIntoDark')
        if (fetchtInstance.result !== 1) return alert(fetchtInstance.message)
    }

    roundEndHandle() {
        const fetchtInstance = await fetch.post('roundEnd')
        if (fetchtInstance.result !== 1) return this.reGetConfirm(this.roundEndHandle)
    }

    render() {
        const { actionNumberNo } = this.state

        return <div>
            {/* CardBackground will same as other.jsx | when it repeat, please abstract it */}
            <Card
                ref={ref = this.card}
                onClick={this.openCard}
            >
                <PlayRole roleInfor={User.playRole} onClick={this.hidenCard}/>
                {['Wlof', 'KingWolf'].includes(User.playRole.name) && // can move to inside
                <WlofEffectSkill onClick={this.wlofEffectHandle}/>}
                <RoundEnd
                    start={actionNumberNo === User.playRole.numberNo} 
                    onClick={this.roundEndHandle}
                />
            </Card>

            <LeadershipSelected ref={ref = this.leadershipSelected} />
            <RoundStartSelected ref={ref = this.roundStartSelected} />
            <KingWolfEffectSelected ref={ref = this.kingWolfEffectSelected} />
            <VoteEffectSelected ref={ref = this.voteEffectSelected} />
        </div>
    }
}
