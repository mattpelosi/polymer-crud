import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "../components/get-user-button";
import "../components/user-form";
import "@polymer/polymer/lib/elements/dom-repeat.js";

/**
 * @customElement
 * @polymer
 */
class PolymerTestAppApp extends PolymerElement {
  ready() {
    super.ready();
    this.addEventListener("get-new-user", e => this.getNewUser(e));
  }

  static get properties() {
    return {
      user: {
        type: Object
      },
      users: {
        type: Array,
        value: []
      }
    };
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>

      <get-user-button></get-user-button>
      
      <user-form user=[[user]] dob=[[dob]] title=[[]]></user-form>
      
      <div class="usersList">
        <template is="dom-repeat" items="[[users]]">
          <div class="user">
            <img src=[[item.image]]>
            <p>{{item.name.title}}</p>
            <p>{{item.name.first}}</p>
            <p>{{item.name.last}}</p>
            <button on-click="deleteUser" data-item$={{item.username}}>Delete</button>
            <button on-click="editUser" data-item$={{item.username}}>Edit</button>
          </div>
        </template>
      </div>
    `;
  }

  async getNewUser() {
    const data = await fetch("https://randomuser.me/api/?nat=US").then(
      response => {
        return response.json();
      }
    );
    const user = this.parseNewUserObject(data.results[0]);
    this.user = user;
    this.writeUserToLocalStorage(user);
  }

  parseNewUserObject(user) {
    const parsedUser = {
      name: user.name,
      dob: this.formatDate(user.dob.date),
      address: {
        street: user.location.street,
        city: user.location.city,
        state: user.location.state,
        postcode: user.location.postcode
      },
      contact: {
        email: user.email,
        phone: user.phone,
        cell: user.cell
      },
      id: user.login.uuid,
      image: user.picture.thumbnail,
      login: {
        username: user.login.username,
        password: user.login.password
      }
    };
    return parsedUser;
  }

  formatDate(date) {
    const newDate = new Date(date);
    let day = newDate.getDate().toString();
    if (day.length === 1) {
      day = `0${day}`;
    }
    let month = newDate.getMonth().toString();
    if (month.length === 1) {
      month = `0${month}`;
    }
    const year = newDate.getFullYear();
    const formatted = `${year}-${month}-${day}`;
    return formatted;
  }

  writeUserToLocalStorage(user) {
    if (localStorage.users) {
      const users = JSON.parse(localStorage.users);
      users.push(user);
      localStorage.setItem("users", JSON.stringify(users));
    } else {
      localStorage.setItem("users", JSON.stringify([user]));
    }
    this.unshift("users", user);
  }

  editUser(event) {
    const key = event.target.dataset.item;
    for (let item in this.users) {
      if (this.users[item].username === key) {
        this.userData = this.users[item];
      }
    }
  }

  deleteUser(event) {
    const key = event.target.dataset.item;
    for (let item in this.users) {
      if (this.users[item].username === key) {
        const index = this.users.indexOf(this.users[item]);
        this.splice("users", index, 1);
      }
    }
    console.log(event.target.dataset);
  }
}

window.customElements.define("polymer-test-app-app", PolymerTestAppApp);
