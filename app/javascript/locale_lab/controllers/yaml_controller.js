import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static outlets = ['editor']

  static values = {
    yaml: { type: String, default: '' },
    locale: String,
    action: String
  }

  editInEditor() {
    this.editorOutlet.show(this.yamlValue, this.editorOutlet.yaml)
    this.editorOutlet.onSave((new_value) => {
      // TODO: Save the new value
      console.log(new_value)
    });


  }

  editInEditor() {
    this.editorOutlet.action  = this.actionValue
    this.editorOutlet.locale  = this.localeValue
    this.editorOutlet.content = this.yamlValue
    this.editorOutlet.type    = this.editorOutlet.yaml
    this.editorOutlet.show()
  }
}
