import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "../components/get-user-button";
import "../components/user-form";
import "../components/users-list";

/**
 * @customElement
 * @polymer
 */
class PolymerTestAppApp extends PolymerElement {
  ready() {
    super.ready();
    this.addEventListener("get-new-user", e => this.getNewUser(e));
    this.addEventListener("edit-user", e => this.editUser(e));
    this.addEventListener("delete-user", e => this.deleteUser(e));
    this.addEventListener("upload-image", e => this.uploadImage(e));
    this.addEventListener("save-user", e => this.saveUser(e));
    this.addEventListener("update-user", e => this.updateUser(e));
    this.addEventListener("clear-form", e => this.clearForm(e));
    this.user = this.parseNewUserObject();
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
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: 25% 75%
        }
        .user-form{
          grid-row: 2;
          grid-column: 1;
        }
        .user-list{
          grid-row: 2;
          grid-column: 2;
        }
       
      </style>
      <get-user-button class="get-user-button"></get-user-button>      
      <user-form user=[[user]] class="user-form"></user-form>
      <user-list users=[[users]] class="user-list"></user-list>
    `;
  }

  async getNewUser() {
    const data = await fetch("https://randomuser.me/api/?nat=US").then(
      response => {
        return response.json();
      }
    );
    const user = this.parseNewUserObject(data.results[0]);
    this.unshift("users", user);
  }

  parseNewUserObject(user) {
    const parsedUser = {
      name: user
        ? user.name
        : {
            title: "",
            first: "",
            last: ""
          },
      dob: user ? this.formatDate(user.dob.date) : "",
      address: {
        street: user ? user.location.street : "",
        city: user ? user.location.city : "",
        state: user ? user.location.state : "",
        postcode: user ? user.location.postcode : ""
      },
      contact: {
        email: user ? user.email : "",
        phone: user ? user.phone : "",
        cell: user ? user.cell : ""
      },
      id: user ? user.login.uuid : "",
      image: user ? user.picture.thumbnail : "",
      login: {
        username: user ? user.login.username : "",
        password: user ? user.login.password : ""
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

  editUser(event) {
    const id = event.detail.id;
    for (let user of this.users) {
      if (user.id === id) {
        this.user = user;
        break;
      }
    }
  }

  deleteUser(event) {
    const id = event.detail.id;
    for (let user of this.users) {
      if (user.id === id) {
        const index = this.users.indexOf(user);
        this.splice("users", index, 1);
        break;
      }
    }
    if (this.user.id === id) {
      this.user = this.parseNewUserObject();
    }
  }

  uploadImage(e) {
    this.set("user.image", e.detail.image);
  }

  saveUser(e) {
    this.unshift("users", e.detail.user);
  }

  updateUser(e) {
    for (let user of this.users) {
      if (user.id === e.detail.user.id) {
        const index = this.users.indexOf(user);
        debugger;
        this.splice("users", index, 1, e.detail.user);
        break;
      }
    }
  }

  clearForm() {
    this.user = this.parseNewUserObject();
  }
}

window.customElements.define("polymer-test-app-app", PolymerTestAppApp);
