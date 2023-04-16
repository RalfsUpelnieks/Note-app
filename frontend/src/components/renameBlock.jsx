import React from "react";
import ContentEditable from "react-contenteditable";
import { Draggable } from "react-beautiful-dnd";

import styles from '../stylesheets/Block.module.css'
import ActionMenu from "./actionMenu";
import { setCaretToEnd, getCaretCoordinates, getSelection } from "../utils/caretControl";

class RenameBlock extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.contentEditable = React.createRef();
    this.fileInput = null;
    this.state = {
      html: "",
      placeholder: false,
      previousKey: null,
      isTyping: false
    };
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      html: this.props.html
    });
  }

  componentDidUpdate(prevState) {
    const stoppedTyping = prevState.isTyping && !this.state.isTyping;
    const htmlChanged = this.props.html !== this.state.html;
    if (stoppedTyping && htmlChanged) {
      this.props.updateTitle({
        html: this.state.html,
      });
    }
  }

  handleChange(e) {
    this.setState({ ...this.state, html: e.target.value });
    this.props.updateTitle({
      html: e.target.value,
    });
  }

  handleFocus() {
    // If a placeholder is set, we remove it when the block gets focused
    if (this.state.placeholder) {
      this.setState({
        ...this.state,
        html: "",
        placeholder: false,
        isTyping: true,
      });
    } else {
      this.setState({ ...this.state, isTyping: true });
    }
  }

  handleKeyDown(e) {
    if (e.key === "Enter" && this.state.previousKey !== "Shift") {
      // If the user presses Enter, we want to add a new block
      // Only the Shift-Enter-combination should add a new paragraph,
      // i.e. Shift-Enter acts as the default enter behaviour
      e.preventDefault();
      this.props.addBlock({
        id: this.props.id,
        html: this.state.html,
        tag: "h1",
        ref: this.contentEditable.current,
      });
    }
    // We need the previousKey to detect a Shift-Enter-combination
    this.setState({ previousKey: e.key });
  }

  render() {
    return (
      <>
        <div className={styles.draggable}>
            <ContentEditable
              innerRef={this.contentEditable} 
              data-position={this.props.position} 
              data-tag={"h1"} 
              html={this.state.html} 
              onChange={this.handleChange} 
              onFocus={this.handleFocus} 
              onKeyDown={this.handleKeyDown}
              tagName={"h1"}
              placeholder="Untitled"
              className={[styles.block, this.state.isTyping , this.state.placeholder ? styles.placeholder : null].join(" ")}
            />
        </div>
      </>
    );
  }
}

export default RenameBlock;