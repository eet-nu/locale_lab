import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  
  static values = { height: String }

  static classes = [ 'overflow' ]

  connect () {
    if (!this.element.value == '') {
      this.grow()
    }

    this.element.classList.add(this.overflowClass)
  }

  grow () {
    if (this.element.hasAttribute('rows')) {
      this.element.removeAttribute('rows')
    }

    this.element.style.height = this.heightValue
    this.element.style.height = this.element.scrollHeight + 'px'
  }
}
