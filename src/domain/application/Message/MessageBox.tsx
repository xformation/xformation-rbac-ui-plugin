import * as React from 'react';
import "./MessageBox.css";

interface MsgProps extends React.HTMLAttributes<HTMLElement> {
    id?: string | any;
    // messageType: any;
    message?: string | any;
    activeTab?: string | any;
    messageOnClose?: string | any;
}

export class MessageBox extends React.Component<MsgProps, any> {
    constructor(props: MsgProps) {
        super(props);
        this.state = {
            activeState: this.props.activeTab,
            message : this.props.message,
            messageOnClose: this.props.messageOnClose
        };
        this.closeDiv = this.closeDiv.bind(this);
    }

    closeDiv() {
        const {message, messageOnClose} = this.state;
        this.setState({
          activeState: -1,
          message: messageOnClose
        });
    }
    

    render() {
        // const {message} = this.props
        const {activeState, message, messageOnClose} = this.state;
        return (
            <main>
                <div className={`${activeState === -1 ? 'info msgbox-border form-h5' : 'hide'}`}>
                    <div>{messageOnClose}</div>
                </div>
                <div className={`${activeState === 0 ? 'info msgbox-border form-h5 msgbox-width-height' : 'hide'}`}>
                    <div>{message}</div>
                    <hr className='msgbox-hr'></hr>
                </div>
                <div className={`${activeState === 1 ? 'successMsgBackGround msgbox-border msgbox-padding msgbox-width-height text' : 'hide'}`}>
                    {message}
                </div>
                <div className={`${activeState === 2 ? 'errorMsgBackGround msgbox-border msgbox-padding msgbox-width-height text' : 'hide'}`}>
                    {message}
                </div>
            </main>
            
            
        );
    }
}

export default MessageBox;