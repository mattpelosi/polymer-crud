import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";

class userForm extends PolymerElement {
  static get properties() {
    return {
      user: {
        type: Object,
        observer: "_receiveNewUser",
        value: {
          name: "",
          dob: "",
          address: {
            street: "",
            city: "",
            state: "",
            postcode: ""
          },
          contact: {
            email: "",
            phone: "",
            cell: ""
          },
          id: "",
          image: "",
          login: {
            username: "",
            password: ""
          }
        }
      }
    };
  }

  static get template() {
    return html`
        <style>
        
        </style>

        <div class="form">
            <img src=[[user.image]]>
            <div class="name">
                <select class="title" name="title" on-change="onChange">
                    <option value="">Title</option>
                    <option value="mr">mr</option>
                    <option value="ms">ms</option>
                    <option value="mrs">mrs</option>
                </select>
                <div class="first">
                    <label for="first">First:</label>
                    <input name="first" type="text" value=[[user.name.first]] on-input="onChange">
                </div>
                <div class="last">
                    <label for="last">Last:</label>
                    <input name="last" type="text" value=[[user.name.last]] on-input="onChange">
                </div>
            </div>
            </div class="dob">
                <label for="dob">Date of birth:</label>
                <input name="dob" type="dob" value=[[user.dob]] on-input="onChange">
            <div class="address">
            <h3>Address</h3>
            <div>
                <label for="street">Street:</label>
                <input name="street" type="text" value=[[user.address.street]] on-input="onChange">
            </div>
            <div>
                <label for="city">City:</label>
                <input name="city" type="text" value=[[user.address.city]] on-input="onChange">
            </div>
            <div>
                <label for="state">State:</label>
                <input name="state" type="text" value=[[user.address.state]] on-input="onChange">
            </div>
            <div>
                <label for"postcode">ZipCode:</label>
                <input name="postcode" type="text" value=[[user.address.postcode]] on-input="onChange">
            </div>
        
            <div class="contact">
                <h3>Contact</h3>
                <div>
                    <label for="email">Email:</label>
                    <input type="email" value=[[user.contact.email]] on-input="onChange">

                </div>
                <div>
                    <label for="cell">Cell:</label>
                    <input name="cell" type="tel" value=[[user.contact.cell]] pattern="\d{10,}" on-input="onChange">
                </div>
                <div>
                    <label for="phone">Phone:</label>
                    <input name="phone" type="tel" value=[[user.contact.phone]] pattern="\d{10,}" on-input="onChange">
                </div>
            </div>
      </div>
        `;
  }

  _receiveNewUser() {
    this.selectTitleOption(this.user);
  }

  selectTitleOption() {
    const title = this.user.name.title;
    const select = this.shadowRoot.querySelectorAll(".title option");

    if (title) {
      if (title === "miss") {
        select["2"].selected = true;
      } else {
        for (let option in select) {
          if (select[option].innerText === title) {
            select[option].selected = true;
          }
        }
      }
    }
  }

  onChange(e) {
    const val = e.target.value;
    const name = e.target.name;
    if (this.user) {
      this.findAndSetValue(this.user, name, val);
    }
  }

  findAndSetValue(user, name, val) {
    for (let prop in user) {
      if (typeof user[prop] === "string") {
        if ((prop = name)) {
          this.user[prop] = val;
          console.log(val);
        }
      } else if (typeof user[prop] === "object") {
        this.findAndSetValue(user[prop], name, val);
      }
      break;
    }
  }
}

window.customElements.define("user-form", userForm);
