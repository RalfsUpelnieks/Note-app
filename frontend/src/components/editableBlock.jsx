import React from "react";
import { Draggable } from "react-beautiful-dnd";

import styles from '../stylesheets/Block.module.css'
import ActionMenu from "./actionMenu";
import { setCaretToEnd, getCaretCoordinates, getSelection } from "../utils/caretControl";

const CMD_KEY = "/";

class EditableBlock extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleDragHandleClick = this.handleDragHandleClick.bind(this);
        this.openActionMenu = this.openActionMenu.bind(this);
        this.closeActionMenu = this.closeActionMenu.bind(this);
        this.handleTagSelection = this.handleTagSelection.bind(this);
        this.calculateActionMenuPosition = this.calculateActionMenuPosition.bind(this);
        this.contentEditable = React.createRef();
        this.fileInput = null;
        this.state = {
            htmlBackup: null,
            html: "",
            htmlInput: "",
            tag: "p",
            uniqueData: "",
            placeholder: "Press '/' for commands",
            isTyping: false,
            actionMenuOpen: false,
            actionMenuPosition: { x: null, y: null,}
        };
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            html: this.props.html,
            htmlInput: this.props.html,
            tag: this.props.tag,
            uniqueData: this.props.uniqueData,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        // update the page on the server if one of the following is true
        // 1. user stopped typing and the html content has changed
        // 2. user changed the tag
        // 3. user changed the unique data changed
        const stoppedTyping = prevState.isTyping && !this.state.isTyping;
        const htmlChanged = this.props.html !== this.state.html;
        const tagChanged = this.props.tag !== this.state.tag;
        const uniqueDataChanged = this.props.uniqueData !== this.state.uniqueData;
        if ((stoppedTyping && htmlChanged) || tagChanged || uniqueDataChanged) {
            clearTimeout(this.timer);
            this.props.updateBlock({
                id: this.props.id,
                html: this.state.html,
                tag: this.state.tag,
                uniqueData: this.state.uniqueData,
            });
        }
    }

    componentWillUnmount() {
        // In case, the user deleted the block, we need to cleanup all listeners
        document.removeEventListener("click", this.closeActionMenu, false);
    }

    handleChange(e) {
        this.setState({ ...this.state, html: e.target.textContent });

        clearTimeout(this.timer);
        if(this.props.html != e.target.textContent && this.state.html.charAt(this.state.html.length - 1) !== "/") {
            this.timer = setTimeout(() => { 
                this.props.updateBlock({
                    id: this.props.id,
                    html: this.state.html,
                    tag: this.state.tag,
                    uniqueData: this.state.uniqueData,
                });
            }, 1200);
        }
    }

    handleFocus() {
        this.setState({ ...this.state, isTyping: true });
    }

    handleBlur(e) {
        this.setState({ ...this.state, isTyping: false });
    }

    handleKeyDown(e) {
        if (e.key === CMD_KEY) {
            // If the user starts to enter a command, we store a backup copy of
            // the html. We need this to restore a clean version of the content
            // after the content type selection was finished.
            this.setState({ htmlBackup: this.state.htmlInput });
        } else if (e.key === "Backspace" && !this.state.html) {
            e.preventDefault();
            this.props.deleteBlock({ id: this.props.id });
        } else if (e.key === "Enter" && !window.event.shiftKey && !this.state.actionMenuOpen) {
            // If the user presses Enter, we want to add a new block
            // Only the Shift-Enter-combination should add a new paragraph,
            // i.e. Shift-Enter acts as the default enter behaviour
            e.preventDefault();
            this.props.addBlock({
                id: this.props.id,
                html: this.state.html,
                tag: this.state.tag,
                uniqueData: this.state.uniqueData,
                ref: this.contentEditable.current,
            });
        }
    }

    // The openTagSelectorMenu function needs to be invoked on key up. Otherwise
    // the calculation of the caret coordinates does not work properly.
    handleKeyUp(e) {
        if (e.key === CMD_KEY) {
            this.openActionMenu();
        }
    }

    handleDragHandleClick(e) {
        const dragHandle = e.target;
        this.openActionMenu(dragHandle, "Drag_Handle");
    }

    openActionMenu() {
        const { x, y } = this.calculateActionMenuPosition();
        this.setState({
            ...this.state,
            actionMenuPosition: { x: x, y: y },
            actionMenuOpen: true,
        });
        // Add listener asynchronously to avoid conflicts with
        // the double click of the text selection
        setTimeout(() => {
            document.addEventListener("click", this.closeActionMenu, false);
        }, 100);
    }

    closeActionMenu() {
        this.setState({
            ...this.state,
            htmlBackup: null,
            actionMenuPosition: { x: null, y: null },
            actionMenuOpen: false,
        });
        document.removeEventListener("click", this.closeActionMenu, false);
    }

    // Convert editableBlock shape based on the chosen tag
    // i.e. img = display <div><input /><img /></div> (input picker is hidden)
    // i.e. every other tag = <ContentEditable /> with its tag and html content
    handleTagSelection(tag) {
        if (tag === "img") {
        this.setState({ ...this.state, tag: tag }, () => {
            this.closeActionMenu();
            if (this.fileInput) {
                // Open the native file picker
                this.fileInput.click();
            }
            // Add new block so that the user can continue writing
            // after adding an image
            this.props.addBlock({
                id: this.props.id,
                html: "",
                tag: "p",
                uniqueData: "",
                ref: this.contentEditable.current,
            });
        });
        } else {
            if (this.state.isTyping) {
                // Update the tag and restore the html backup without the command
                this.setState({ tag: tag, html: this.state.htmlBackup }, () => {
                    setCaretToEnd(this.contentEditable.current);
                    this.closeActionMenu();
                });
            } else {
                this.setState({ ...this.state, tag: tag }, () => {
                    this.closeActionMenu();
                });
            }
        }
    }

    // If the user types the "/" command, the tag selector menu should be display above
    // If it is triggered by the action menu, it should be positioned relatively to its initiator
    calculateActionMenuPosition(parent = null) {
        if(!parent) {
            const { x: caretLeft, y: caretTop } = getCaretCoordinates(true);
            return { x: caretLeft, y: caretTop + 22};
        } else {
            const x = parent.offsetLeft - parent.scrollLeft + parent.clientLeft - 120;
            const y = parent.offsetTop - parent.scrollTop + parent.clientTop - 70;
            return { x: x, y: y };
        }
    }

    render() {
        return (
        <>
            {this.state.actionMenuOpen && (
                <ActionMenu
                    position={this.state.actionMenuPosition}
                    closeMenu={this.closeActionMenu}
                    handleSelection={this.handleTagSelection}
                    actions={{ deleteBlock: () => this.props.deleteBlock({ id: this.props.id }) }}
                />
            )}
            <Draggable key={this.props.id} draggableId={this.props.id} index={this.props.position}>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} className={styles.draggable} {...provided.draggableProps} style={!snapshot.isDropAnimating ? provided.draggableProps.style : { ...provided.draggableProps.style, transitionDuration: '0.01s' }}> 
                    <span role="button" tabIndex="0" className={styles.dragHandle} onClick={this.handleDragHandleClick} {...provided.dragHandleProps}>
                        <i className="fa fa-bars" alt="Icon"/>
                    </span>
                    {
                        React.createElement(this.state.tag, {
                            ref: this.contentEditable,
                            "data-position": this.props.position,
                            
                            onInput: this.handleChange,
                            onFocus: this.handleFocus,
                            onBlur: this.handleBlur,
                            onKeyDown: this.handleKeyDown,
                            onKeyUp: this.handleKeyUp,
                            contentEditable: true,
                            placeholder: this.state.placeholder,

                            dangerouslySetInnerHTML: { __html: this.state.htmlInput },
                            className: [styles.block, this.state.isTyping || this.state.actionMenuOpen ? styles.blockSelected : null, snapshot.isDragging ? styles.isDragging : null,].join(" "),
                        })
                    }
                    </div>
                )}
            </Draggable>
        </>
        );
    }
}

export default EditableBlock;