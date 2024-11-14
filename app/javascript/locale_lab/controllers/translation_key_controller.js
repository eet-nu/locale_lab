import { Controller } from '@hotwired/stimulus'

export default class extends Controller {

  static targets = ['moveForm', 'input']

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

  toggleForm() {
    this.moveFormTarget.classList.toggle(this.hiddenClass)
  }

}
