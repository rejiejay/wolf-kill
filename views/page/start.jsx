import WebSocket from './module/web-socket'

export const PageStart = {
    ref: React.createRef(),

    react: <ReactComponent ref={PageStart.ref} />,

    init: async function () {
        await render(this.react)
        WebSocket.bind(this.ref)
    }
}

class ReactComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isEdit: this.props.isEdit,
            value: this.props.value
        }
    }

    render() {
        return
            ;
    }
}

const render = component => new Promise(resolve => ReactDOM.render(component, document.body, instance => resolve(instance)))

export const PageRelink = {
    init: () => { }
}