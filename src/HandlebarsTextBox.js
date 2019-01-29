import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {EditorState, ContentState, Modifier} from 'draft-js';
import {registerCopySource, handleDraftEditorPastedText} from 'draftjs-conductor';
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

  componentDidMount() {
    if (this.editor && this.editor.getEditorRef() && this.editor.getEditorRef().editor) {
      this.copySource = registerCopySource(this.editor.getEditorRef());
    }
  }

  componentWillUnmount() {
    if (this.copySource) {
      this.copySource.unregister();
    }
  }

  onChange() {
    const {editorState} = this.state;
    const content = editorState.getCurrentContent();
    const value = draftToHandlebars(content);
    this.props.onChange(value);
  }

  _handlePaste(text, html, editorState) {
    if (html) {
      // TODO Strip jump of lines in html
      this._handleChange(handleDraftEditorPastedText(html, editorState));
    } else {
      this._handleChange(EditorState.push(
          editorState,
          Modifier.replaceText(
              this.state.editorState.getCurrentContent(),
              this.state.editorState.getSelection(),
              text.replace(/\n/g, ' ')
          )
      ));
    }
    return 'handled';
  }

  _handleChange(editorState) {
    this.setState({editorState}, this.debouncedOnChange);
  }

  render() {
    return <div className={`handlebarsTextBox ${this.props.className || ''}`} style={this.props.style || {}}>
      <Editor
        spellCheck
        ref={(b) => this.editor = b}
        className='handlebarsTextBox'
        onChange={this._handleChange}
        editorState={this.state.editorState}
        plugins={this.plugins}
        handleReturn={() => 'handled'}
        handlePastedText={this._handlePaste}
        placeholder={this.props.placeholder}
      />
    </div>;
  }
}

HandlebarsTextBox.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  placeholder: PropTypes.string,
};

export default HandlebarsTextBox;
