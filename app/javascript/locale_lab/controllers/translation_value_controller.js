import { Controller } from '@hotwired/stimulus'

export default class extends Controller {

  static values = {
    textArea: String
  }

  static targets = ['textArea', 'submitButton', 'discardButton']

  static outlets = ['editor']

  connect() {
    this.element.addEventListener('submit', this.disableSubmitButton.bind(this));
  }

  get textareaChanged() {
    return this.textAreaValue !== this.textAreaTarget.value
  }

  disableSubmitButton(event) {
    this.submitButtonTarget.disabled = true;
  }

  editInEditor() {
    this.editorOutlet.show(this.textAreaTarget.value)
    this.editorOutlet.onSave((new_value) => {
      this.textAreaTarget.value = new_value
      this.submitIfChanged()
    });
  }

  discard(event) {
    // preventDefault because else the form will submit
    event.preventDefault()
    this.textAreaTarget.value = this.textAreaValue
    this.toggleDiscardButton()
  }

  toggleDiscardButton() {
    this.discardButtonTarget.disabled = !this.textareaChanged
  }

  submitIfChanged() {
    // Wait a little, the user can have clicked the discard button while
    // the textarea was active, that also triggers the blur event
    setTimeout(() => {
      if (this.textareaChanged) {
        this.element.requestSubmit()
      }
    }, 500)
  }
}
