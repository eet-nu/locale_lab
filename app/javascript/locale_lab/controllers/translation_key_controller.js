import { Controller } from '@hotwired/stimulus'

export default class extends Controller {

  static targets = ['form']

  static classes = ['hidden']

  connect() {
    console.log('connected')
  }

  toggleForm() {
    this.formTarget.classList.toggle(this.hiddenClass)
  }

}
