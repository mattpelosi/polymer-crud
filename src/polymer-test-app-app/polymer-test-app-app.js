import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";

/**
 * @customElement
 * @polymer
 */
class PolymerTestAppApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>


      <h2>Hello [[prop1]]!</h2>

      <button on-click="handleClick">Get user profile</button>

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
    this.dob = this.formatDate(userData.dob.date);
    this.title = this.setTitle(userData.name.title);
    this.userData = userData;
    console.log(this.userData);
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
}

window.customElements.define("polymer-test-app-app", PolymerTestAppApp);
