import { Controller } from '@hotwired/stimulus'

export default class extends Controller {

  static targets = ['form', 'input']

  static classes = ['hidden']

  connect() {
    console.log('connected')
  }

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
    this.formTarget.classList.toggle(this.hiddenClass)
  }

}
