import { Controller } from '@hotwired/stimulus'

export default class extends Controller {

  static values = {
    textArea: String
  }

  static targets = ['textArea', 'submitButton']

  connect() {
    this.element.addEventListener("submit", this.disableButton.bind(this));
  }

  get textareaChanged() {
    return this.textAreaValue !== this.textAreaTarget.value
  }

  disableButton(event) {
    if (this.hasSubmitButtonTarget) {
      this.submitButtonTarget.disabled = true;
    }
  }

  focus() {
    this.textAreaValue = this.textAreaTarget.value
  }

  submitIfChanged() {
    if (this.textareaChanged) {
      this.element.requestSubmit()
    }
  }
}
