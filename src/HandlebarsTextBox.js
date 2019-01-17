import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {EditorState, ContentState, convertToRaw, Modifier} from 'draft-js';
import debounce from 'debounce';
import Editor from 'draft-js-plugins-editor';
import draftToHandlebars from './draftToHandlebars';

import createPlaceholderVisualizationPlugin from 'draft-js-handlebars-plugin';
import './handlebarsTextBox.css';

class HandlebarsTextBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: this.props.value ? EditorState.createWithContent(ContentState.createFromText(this.props.value)) : EditorState.createEmpty(),
    };

    this.plugins = [createPlaceholderVisualizationPlugin()];
    this.debouncedOnChange = debounce(this.onChange, 300);
    this._handleChange = this._handleChange.bind(this);
    this._handlePaste = this._handlePaste.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // const editorState = EditorState.createWithContent(ContentState.createFromText(nextProps.value))
    // this.setState({editorState})
  }

  onChange() {
    const content = this.state.editorState.getCurrentContent();
    const value = draftToHandlebars(convertToRaw(content));
    this.props.onChange(value);
  }

  _handlePaste(text) {
    this._handleChange(EditorState.push(
        this.state.editorState,
        Modifier.replaceText(
            this.state.editorState.getCurrentContent(),
            this.state.editorState.getSelection(),
            text.replace(/\n/g, ' ')
        )
    ));

    return 'handled';
  }

  _handleChange(editorState) {
    this.setState({editorState}, this.debouncedOnChange);
  }

  render() {
    return <div className={`handlebarsTextBox ${this.props.className || ''}`}>
      <Editor
        spellCheck
        ref={(b) => this.editor = b}
        className='handlebarsTextBox'
        onChange={this._handleChange}
        editorState={this.state.editorState}
        plugins={this.plugins}
        handleReturn={() => 'handled'}
        handlePastedText={this._handlePaste}
      />
    </div>;
  }
}

HandlebarsTextBox.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default HandlebarsTextBox;
