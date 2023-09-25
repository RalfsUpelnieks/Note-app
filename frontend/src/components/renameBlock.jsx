import React from "react";
import styles from '../stylesheets/Block.module.css'

class RenameBlock extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.inputValue = this.props.html;
        this.timer = null;
        this.state = {
            isTyping: false
        };
    }

    componentDidUpdate(prevProps, prevState) {
        const stoppedTyping = prevState.isTyping && !this.state.isTyping;
        const htmlChanged = this.props.html != this.inputValue;

        if (stoppedTyping && htmlChanged) {
            clearTimeout(this.timer);
            this.props.updateTitle({html: this.inputValue});
        }
    }

    handleChange(e) {
        this.inputValue = e.target.textContent;

        const index = this.props.pages.map((p) => p.pageId).indexOf(this.props.pageId);
        const updatedPages = [...this.props.pages];
        updatedPages[index] = {...updatedPages[index], title: this.inputValue};
        this.props.setPages(updatedPages);

        clearTimeout(this.timer);
        if(this.props.html != this.inputValue) {
            this.timer = setTimeout(() => { 
                this.props.updateTitle({html: this.inputValue});
            }, 1200);
        }
    }
  
    handleFocus() {
        this.setState({ ...this.state, isTyping: true });
    }

    handleBlur() {
        this.setState({ ...this.state, isTyping: false});
    }

    handleKeyDown(e) {
        if (e.key === "Enter" && !window.event.shiftKey) {
            e.preventDefault();
            this.props.addBlock();
        }
    }

    render() {
        return (
            <div className={styles.draggable}>
                <h1 dangerouslySetInnerHTML={{__html: this.props.html}}
                    key={this.props.pageId}
                    onInput={this.handleChange}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur} 
                    onKeyDown={this.handleKeyDown}
                    placeholder="Untitled"
                    contentEditable="true" 
                    className={styles.title}
                ></h1>
            </div>
        );
    }
}

export default RenameBlock;