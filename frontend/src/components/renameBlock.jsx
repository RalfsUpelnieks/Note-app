import React from "react";
import styles from '../stylesheets/Block.module.css'

class RenameBlock extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.contentEditable = React.createRef();
        this.value = this.props.html;
        this.timer = null;
        this.state = {
            isTyping: false,
        };
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            inputHtml: this.props.html,
            htmlHistory: this.props.html
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const stoppedTyping = prevState.isTyping && !this.state.isTyping;
        const htmlChanged = this.state.htmlHistory != this.value;
        if (stoppedTyping && htmlChanged) {
            clearTimeout(this.timer);
            this.props.updateTitle({html: this.value});
            this.setState({ ...this.state, htmlHistory: this.value}); 
        }
    }

    handleChange(e) {
        this.value = e.target.textContent;

        const index = this.props.pages.map((p) => p.pageId).indexOf(this.props.pageId);
        const updatedPages = [...this.props.pages];
        updatedPages[index] = {...updatedPages[index], title: this.value};
        this.props.setPages(updatedPages);

        clearTimeout(this.timer);
        if(this.props.html != e.target.textContent) {
            this.timer = setTimeout(() => { 
                this.props.updateTitle({html: e.target.textContent});
                this.setState({ ...this.state, htmlHistory: this.value }); 
            }, 1200);
        }
    }
  
    handleFocus() {
        this.setState({ ...this.state, isTyping: true });
    }

    handleBlur() {
        this.setState({ ...this.state, isTyping: false });
    }

    handleKeyDown(e) {
        if (e.key === "Enter" && !window.event.shiftKey) {
            e.preventDefault();
            this.props.addBlock({
                id: this.props.id,
                html: this.state.inputHtml,
                tag: "h1",
                ref: this.contentEditable.current,
            });
        }
    }

    render() {
        return (
            <>
                <div className={styles.draggable}>
                <h1 onInput={this.handleChange} onFocus={this.handleFocus} onBlur={this.handleBlur} onKeyDown={this.handleKeyDown} placeholder="Untitled" contentEditable="true" className={styles.title}>
                    {this.state.inputHtml}
                </h1>
                </div>
            </>
        );
    }
}

export default RenameBlock;