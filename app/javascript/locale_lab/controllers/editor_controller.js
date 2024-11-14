import { Controller } from '@hotwired/stimulus'

import { basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { EditorView, ViewPlugin, Decoration, MatchDecorator } from '@codemirror/view';
import { html } from '@codemirror/lang-html';

export default class extends Controller {

  static targets = ['editor']

  static values = {
    minimumLines: { type: Number, default: 10 }
  }

  static classes = ['hidden']

  connect() {
    this.loadEditor()
  }

  get interpolationTemplate()
  {
    let decorator = new MatchDecorator({
      regexp: /%\{([^}]+)\}/g,
      decoration: (m) => Decoration.mark({ class: 'interpolation' }),
    });

    return ViewPlugin.define(
      (view) => ({
        decorations: decorator.createDeco(view),
        update(u) {
          this.decorations = decorator.updateDeco(u, this.decorations);
        },
      }),
      {
        decorations: (v) => v.decorations,
      }
    );
  }

  get value()
  {
    return this.editor.state.doc.toString().trim()
  }

  set content(content)
  {
    this.editor.dispatch({
      changes: {
        from: 0,
        to: this.editor.state.doc.length,
        insert: content
      }
    })

    this.updateToMinNumberOfLines()
  }

  get editorView()
  {
    const editorView = new EditorView({
      state: EditorState.create({
        mode: 'text/html',
        extensions: [basicSetup, html(), this.interpolationTemplate],
      }),
    });

    editorView.dom.setAttribute('data-editor-target', 'editor');

    return editorView.dom;
  }

  get editor()
  {
    if (this.hasEditorTarget)
    {
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

  close()
  {
    this.element.classList.add(this.hiddenClass)
    this.content = ''
  }

  show(content)
  {
    if (this.currentEventListener) {
      this.element.removeEventListener('saving', this.currentEventListener);
    }

    this.content = content
    this.element.classList.remove(this.hiddenClass)
    this.editor.focus()
  }

  onSave(callback) {
    const eventListener = (event) => {
      callback(this.value);
    };

    this.currentEventListener = eventListener;
    this.element.addEventListener('saving', eventListener);
  }

  save()
  {
    this.element.dispatchEvent(new Event('saving'));
    this.close();
  }

  loadEditor()
  {
    this.element.prepend(this.editor);
  }
}
