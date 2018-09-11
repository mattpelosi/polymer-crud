import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";

class getUserButton extends PolymerElement {
  static get template() {
    return html`
        <style>
            
        </style>
        <button on-click="handleClick">Get User's Information</button>
        `;
  }
  handleClick() {
    this.dispatchEvent(
      new CustomEvent("generate-new-user", {
        bubbles: true,
        composed: true
      })
    );
  }
}

window.customElements.define("get-user-button", getUserButton);
