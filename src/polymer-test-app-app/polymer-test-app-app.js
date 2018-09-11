import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "../components/get-user-button";
import "@polymer/polymer/lib/elements/dom-repeat.js";

/**
 * @customElement
 * @polymer
 */
class PolymerTestAppApp extends PolymerElement {

  ready() {
    super.ready()
    this.addEventListener("generate-new-user", e => this.handleClick(e));
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>


      <h2>Hello [[prop1]]!</h2>

      <get-user-button></get-user-button>

      <img src=[[userData.picture.thumbnail]]>
      <div class="form">
        <div class="name">
          <select class="title" on-change="handleSelect">
            <option value="">Title</option>
            <option value="mr">mr</option>
            <option value="ms">ms</option>
            <option value="mrs">ms</option>
          </select>
          <input type="text" value=[[userData.name.first]]>
          <input type="text" value=[[userData.name.last]]>
        </div>
          <input type="dob" value=[[dob]]>
        <div class="address">
          <input type="text" value=[[userData.location.street]]>
          <input type="text" value=[[userData.location.city]]>
          <input type="text" value=[[userData.location.state]]>
          <input type="text" value=[[userData.location.postcode]]>
        </div>
        <div class="contact">
          <input type="email" value=[[userData.email]]>
          <input type="tel" value=[[userData.cell]] pattern="\d{10,}">
          <input type="tel" value=[[userData.phone]] pattern="\d{10,}">
        </div>
      </div>
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
  static get properties() {
    return {
      prop1: {
        type: String,
        value: "polymer-test-app-app"
      },
      userData: {
        type: Array
      },
      dob: {
        type: String
      },
      title: {
        type: String
      },
      users: {
        type: Array,
        value: []
      }
    };
  }

  async handleClick() {
    const data = await fetch("https://randomuser.me/api/?nat=US").then(
      response => {
        return response.json();
      }
    );
    const userData = data.results[0];
    this.saveUserDataToLocalStorage(userData);
    this.dob = this.formatDate(userData.dob.date);
    this.title = this.setTitle(userData.name.title);
    this.userData = userData;
  }

  handleSelect(e) {
    this.title = e.target.value;
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

  setTitle(title) {
    const select = this.shadowRoot.querySelectorAll(".title option");
    if (title === "miss") {
      select["2"].selected = true;
    } else {
      for (let option in select) {
        if (select[option].innerText === title) {
          select[option].selected = true;
        }
      }
    }
    return title;
  }

  saveUserDataToLocalStorage(userData) {
    const userObj = {
      name: userData.name,
      dob: this.formatDate(userData.dob.date),
      address: userData.location,
      contact: {
        email: userData.email,
        phone: userData.phone,
        cell: userData.cell
      },
      username: userData.login.username,
      image: userData.picture.thumbnail
    };
    if (localStorage.users) {
      const users = JSON.parse(localStorage.users);
      users.push(userObj);
      localStorage.setItem("users", JSON.stringify(users));
    } else {
      localStorage.setItem("users", JSON.stringify([userObj]));
    }
    this.push("users", userObj);
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
