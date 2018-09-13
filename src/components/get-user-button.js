import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";

class getUserButton extends PolymerElement {
  static get template() {
    return html`
        <style>
            button{
                border: 1px solid green;
                padding: 5px;
                margin: 5px;
            }
        </style>
        <button on-click="handleClick">Get New User</button>
        `;
  }
  handleClick() {
    this.dispatchEvent(
      new CustomEvent("get-new-user", {
        bubbles: true,
        composed: true
      })
    );
  }
}

window.customElements.define("get-user-button", getUserButton);
