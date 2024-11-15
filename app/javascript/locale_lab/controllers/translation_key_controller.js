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

  toggleMoveForm() {
    this.hideDuplicateForm()
    this.moveFormTarget.classList.toggle(this.hiddenClass)
  }

  hideMoveForm() {
    this.moveFormTarget.classList.add(this.hiddenClass)
  }

  toggleDuplicateForm() {
    this.hideMoveForm()
    this.duplicateFormTarget.classList.toggle(this.hiddenClass)
  }

  hideDuplicateForm() {
    this.duplicateFormTarget.classList.add(this.hiddenClass)
  }
}
