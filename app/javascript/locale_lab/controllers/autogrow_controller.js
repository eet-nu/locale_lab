import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  connect () {
    if (!this.element.value == '') {
      this.grow()
    }
  }

  grow () {
    if (this.element.hasAttribute('rows')) {
      this.element.removeAttribute('rows')
    }

    this.element.style.height = 'auto'
    this.element.style.height = this.element.scrollHeight + 'px'
  }
}
