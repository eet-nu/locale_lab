import { Controller } from '@hotwired/stimulus'

export default class extends Controller {

  static targets = ['dropdown']

  static classes = ['hidden']

  toggleDropdown (event) {
    event.preventDefault();
    this.dropdownTarget.classList.toggle(this.hiddenClass);
  }
}
