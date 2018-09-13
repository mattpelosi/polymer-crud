import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";

class usersList extends PolymerElement {
  static get properties() {
    return {
      users: {
        type: Array,
        value: []
      }
    };
  }

  static get template() {
    return html`
        <style>

        .usersList{
            border: 1px solid blue;
            padding: 5px;
            margin: 5px;
            grid-row: 2;            
        }
        .user{            
            border: 1px solid purple;
            margin: 5px;
            padding: 5px;
        }
        .name{
            grid-row: 1;
        }
        </style>

        <div class="usersList">
            <template is="dom-repeat" items="[[users]]">
                <div class="user">
                    <img src=[[item.image]]>
                    <div>
                        <p>[[item.name.title]]</p>
                        <p>[[item.name.first]]</p>
                        <p>[[item.name.last]]</p>
                    </div>                    
                    <button on-click="deleteUser" data-id$=[[item.id]]>Delete</button>
                    <button on-click="editUser" data-id$=[[item.id]]>Edit</button>
                </div>
            </template>
      </div>
        `;
  }

  editUser(e) {
    const id = e.target.dataset.id;
    this.dispatchEvent(
      new CustomEvent("edit-user", {
        bubbles: true,
        composed: true,
        detail: {
          id: id
        }
      })
    );
  }

  deleteUser(e) {
    const id = e.target.dataset.id;
    this.dispatchEvent(
      new CustomEvent("delete-user", {
        bubbles: true,
        composed: true,
        detail: {
          id: id
        }
      })
    );
  }
}

window.customElements.define("user-list", usersList);
