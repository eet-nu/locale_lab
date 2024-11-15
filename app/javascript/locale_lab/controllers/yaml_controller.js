import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static outlets = ['editor']

  static values = {
    yaml: { type: String, default: '' }
  }

  editInEditor() {
    this.editorOutlet.show(this.yamlValue, this.editorOutlet.yaml)
    this.editorOutlet.onSave((new_value) => {
      // TODO: Save the new value
      console.log(new_value)
    });
  }
}
