import { Controller } from '@hotwired/stimulus'

export default class extends Controller {

  static targets = ['moveForm', 'duplicateForm', 'input']

  static classes = ['hidden']

  copyKeyToClipboard (event) {
    if (this.hasInputTarget) {
      if (event) {
        event.preventDefault()
      }

      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.inputTarget.value)
      }

      this.inputTarget.focus()
      this.inputTarget.select()
    }
  }

  showMoveForm() {
    this.hideDuplicateForm()
    this.moveFormTarget.showModal()
  }

  hideMoveForm() {
    this.moveFormTarget.close()
  }

  showDuplicateForm() {
    this.hideMoveForm()
    this.duplicateFormTarget.showModal()
  }

  hideDuplicateForm() {
    this.duplicateFormTarget.close()
  }
}
