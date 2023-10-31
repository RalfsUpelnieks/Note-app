import React from "react";

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
        if(e.target.innerHTML == "<br>") {
            e.target.innerHTML = "";
        }
        
        this.inputValue = e.target.innerHTML;

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
            <h1 dangerouslySetInnerHTML={{__html: this.props.html}}
                key={this.props.pageId}
                data-position={0}
                onInput={this.handleChange}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur} 
                onKeyDown={this.handleKeyDown}
                placeholder="Untitled"
                contentEditable="true" 
                className="w-[calc(100%-2rem)] my-1 break-words cursor-text empty:before:content-[attr(placeholder)] empty:before:text-neutral-400 focus:outline-none"
            ></h1>
        );
    }
}

export default RenameBlock;