import React, { useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";

import styles from '../stylesheets/Block.module.css'
import ActionMenu from "./actionMenu";
import { getCaretCoordinates } from "../utils/caretControl";
import menuList from "../utils/MenuList"

const CMD_KEY = "/";
const PLACEHOLDER = `Press '${CMD_KEY}' for commands`;

class EditableBlock extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handlePropertyChange = this.handlePropertyChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleDragHandleClick = this.handleDragHandleClick.bind(this);
        this.openActionMenu = this.openActionMenu.bind(this);
        this.closeActionMenu = this.closeActionMenu.bind(this);
        this.handleTagSelection = this.handleTagSelection.bind(this);
        this.calculateActionMenuPosition = this.calculateActionMenuPosition.bind(this);
        this.fileInput = null;
        this.state = {
            properties: this.props.properties,
            startingProperties: this.props.properties,
            type: this.props.type,
            isTyping: false,
            actionMenuOpen: false,
            actionMenuPosition: { x: null, y: null,},
            actionMenuCommand: ""
        };
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            properties: this.props.properties,
            startingProperties: this.props.properties,
            type: this.props.type,
        });
    }

    componentDidUpdate(prevProps, prevState) {
        // update the page on the server if one of the following is true
        // 1. user stopped typing and the properties have changed
        // 2. user changed the tag
        const stoppedTyping = prevState.isTyping && !this.state.isTyping;
        const propertiesChanged = this.props.properties !== this.state.properties;
        const tagChanged = this.props.type !== this.state.type;
        if ((stoppedTyping && propertiesChanged) || tagChanged) {
            clearTimeout(this.timer);
            this.props.updateBlock({
                id: this.props.id,
                properties: this.state.properties,
                type: this.state.type
            });
        }
    }

    componentWillUnmount() {
        // In case, the user deleted the block, we need to cleanup all listeners
        document.removeEventListener("click", this.closeActionMenu, false);
    }

    handleChange(e) {
        this.setState({ ...this.state, properties: {...this.state.properties, text: e.target.textContent} });

        clearTimeout(this.timer);
        if(this.props.properties != e.target.textContent) {
            this.timer = setTimeout(() => { 
                this.props.updateBlock({
                    id: this.props.id,
                    properties: this.state.properties,
                    type: this.state.type
                });
            }, 1200);
        }
    }

    handlePropertyChange(property, value){
        const updatedProperties = {...this.state.properties, [property]: value}

        this.setState({ ...this.state, properties: updatedProperties });

        if(this.props.properties.property != updatedProperties){
            this.props.updateBlock({
                id: this.props.id,
                properties: updatedProperties,
                type: this.state.type
            });
        }
    }

    handleFocus() {
        this.setState({ ...this.state, isTyping: true });
    }

    handleBlur(e) {
        this.setState({ ...this.state, isTyping: false });
    }

    handleKeyDown(e) {
        if (e.key === "Backspace" && !this.state.properties.text) {
            e.preventDefault();
            clearTimeout(this.timer);
            this.props.deleteBlock({ id: this.props.id });
        } else if (e.key === "Enter" && !window.event.shiftKey && !this.state.actionMenuOpen) {
            // If the user presses Enter new block is added
            // Only the Shift-Enter-combination adds a new paragraph,
            // i.e. Shift-Enter acts as the default enter behaviour
            e.preventDefault();
            this.props.addBlock({
                id: this.props.id,
                properties: this.state.properties,
                type: this.state.type
            });
        }
    }

    // The openTagSelectorMenu function needs to be invoked on key up. Otherwise
    // the calculation of the caret coordinates does not work properly.
    handleKeyUp(e) {
        if (e.key === CMD_KEY) {
            const coordinates = this.calculateActionMenuPosition();
            this.openActionMenu(coordinates);
        }
    }

    handleDragHandleClick(e) {
        window.getSelection().removeAllRanges();

        const coordinates = this.calculateActionMenuPosition(e.target);
        this.openActionMenu(coordinates);
    }

    openActionMenu(cord) {
        this.setState({
            ...this.state,
            actionMenuPosition: { x: cord.x, y: cord.y },
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
            actionMenuPosition: { x: null, y: null },
            actionMenuOpen: false,
        });
        document.removeEventListener("click", this.closeActionMenu, false);
    }

    // Convert editableBlock shape based on the chosen tag
    handleTagSelection(tag) {
        // Assigning default element properties
        var newProperties = { ...menuList.find((element) => element.id == tag).properties };

        for(let p in newProperties){
            if(this.state.properties[p]){
                newProperties[p] = this.state.properties[p];
            }
        }
        
        this.setState({ ...this.state, type: tag, startingProperties: newProperties, properties: newProperties }, () => {
            this.closeActionMenu();
        });
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
                        React.createElement(menuList.find((element) => element.id == this.state.type).tag, {
                            startingProperties: this.state.startingProperties,
                            properties: this.state.properties,
                            position: this.props.position,
                            placeholder: PLACEHOLDER,
                            onInput: this.handleChange,
                            onPropertyChange: this.handlePropertyChange,
                            onFocus: this.handleFocus,
                            onBlur: this.handleBlur,
                            onKeyDown: this.handleKeyDown,
                            onKeyUp: this.handleKeyUp,
                            className: [styles.block, this.state.isTyping || this.state.actionMenuOpen ? styles.blockSelected : null].join(" "),
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