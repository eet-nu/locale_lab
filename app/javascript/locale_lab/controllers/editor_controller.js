import { Controller } from '@hotwired/stimulus'

import { basicSetup } from 'codemirror';
import { EditorState, StateEffect } from '@codemirror/state';
import { EditorView, ViewPlugin, Decoration, MatchDecorator, keymap } from '@codemirror/view';
import { indentWithTab } from "@codemirror/commands"
import { html } from '@codemirror/lang-html';
import { yaml } from '@codemirror/lang-yaml';

export default class extends Controller {

  static targets = ['editor', 'wrapper', 'form', 'textarea', 'locale']

  static values = {
    minimumLines: { type: Number, default: 10 },
    closeAfterSubmit: { type: Boolean, default: true }
  }

  static classes = ['hidden']

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
  }

  set action(action) {
    this.formTarget.action = action
  }

  set locale(locale) {
    this.localeTarget.value = locale
  }

  set type(contentType) {
    this.editor.dispatch({
      effects: StateEffect.reconfigure.of([...this.editorExtensions, contentType])
    });
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

  get editorExtensions() {
    return [basicSetup, keymap.of([indentWithTab]), this.interpolationTemplate]
  }

  get yaml() {
    this.contentType = 'yaml'
    return yaml()
  }

  get html() {
    this.contentType = 'html'
    return html()
  }

  hideErrorFlash() {
    // TODO: Refactor this selector so it uses an outlet/target
    this.element.querySelectorAll('turbo-frame.dialog_flash').forEach(frame => {
      frame.innerHTML = '';
    });
  }

  show() {
    this.hideErrorFlash()
    this.element.showModal()
    this.editor.focus()
  }

  close() {
    this.element.close()
  }

  loadEditor() {
    if (this.hasWrapperTarget) {
      this.wrapperTarget.prepend(this.editor);
    }
  }

  submit(event) {
    this.textareaTarget.value = this.value

    if (this.closeAfterSubmitValue) {
      this.close()
    }
  }
}
