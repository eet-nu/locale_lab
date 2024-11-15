import { Controller } from '@hotwired/stimulus'

import { basicSetup } from 'codemirror';
import { EditorState, StateEffect } from '@codemirror/state';
import { EditorView, ViewPlugin, Decoration, MatchDecorator } from '@codemirror/view';
import { html } from '@codemirror/lang-html';
import { yaml } from '@codemirror/lang-yaml';

export default class extends Controller {

  static targets = ['editor', 'wrapper']

  static values = {
    minimumLines: { type: Number, default: 10 }
  }

  connect() {
    this.loadEditor()
  }

  get interpolationTemplate() {
    let decorator = new MatchDecorator({
      regexp: /%\{([^}]+)\}/g,
      decoration: (m) => Decoration.mark({ class: 'interpolation' }),
    });

    return ViewPlugin.define((view) => ({
        decorations: decorator.createDeco(view),
        update(u) {
          this.decorations = decorator.updateDeco(u, this.decorations);
        }
      }), { decorations: (v) => v.decorations }
    );
  }

  get value() {
    return this.editor.state.doc.toString().trim()
  }

  set content(content) {
    this.editor.dispatch({
      changes: {
        from: 0,
        to: this.editor.state.doc.length,
        insert: content
      }
    })

    this.updateToMinNumberOfLines()
  }

  get editorView() {
    const editorView = new EditorView({
      state: EditorState.create({mode: 'text/html'}),
    });

    editorView.dom.setAttribute('data-editor-target', 'editor');

    return editorView.dom;
  }

  get editor() {
    if (this.hasEditorTarget) {
      return EditorView.findFromDOM(this.editorTarget)
    }

    return this.editorView
  }

  updateToMinNumberOfLines() {
    const currentNumOfLines = this.editor.state.doc.lines;
    const currentStr = this.editor.state.doc.toString();

    if (currentNumOfLines >= this.minimumLinesValue) {
      return;
    }

    const lines = this.minimumLinesValue - currentNumOfLines;
    const appendLines = "\n".repeat(lines);

    this.editor.dispatch({
      changes: {from: currentStr.length, insert: appendLines},
      selection: {anchor: 0, head: 0}
    })
  }

  close() {
    this.element.close()
    this.content = ''
  }

  get editorExtensions() {
    return [basicSetup, this.interpolationTemplate]
  }

  get yaml() {
    return yaml()
  }

  get html() {
    return html()
  }

  show(content, contentType) {
    if (this.currentEventListener) {
      this.element.removeEventListener('saving', this.currentEventListener);
    }

    this.editor.dispatch({
      effects: StateEffect.reconfigure.of([...this.editorExtensions, contentType])
    });

    this.content = content
    this.element.showModal()
    this.editor.focus()
  }

  onSave(callback) {
    const eventListener = (event) => {
      callback(this.value);
    };

    this.currentEventListener = eventListener;
    this.element.addEventListener('saving', eventListener);
  }

  save() {
    this.element.dispatchEvent(new Event('saving'));
    this.close();
  }

  loadEditor() {
    if (this.hasWrapperTarget) {
      this.wrapperTarget.prepend(this.editor);
    }
  }
}
