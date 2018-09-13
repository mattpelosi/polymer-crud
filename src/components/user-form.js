import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";

class userForm extends PolymerElement {
  static get properties() {
    return {
      user: {
        type: Object,
        observer: "_receiveNewUser",
        value: {
          name: {
            title: "",
            first: "",
            last: ""
          },
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
            :host{
                
            }
            .form{
                border: 1px solid black;
                padding: 5px;
                margin: 5px;
                grid-row: 2;
            }
        </style>

        <div class="form">
            <div class="image">
                <label for="image">Upload Image</label>
                <input type="file" name="image" on-change="uploadImage">  
                <img src=[[user.image]] width="50px" height="50px">
            </div>
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
            <div class="dob">
                <label for="dob">Date of birth:</label>
                <input name="dob" type="dob" value={{user.dob}} on-input="onChange">
            </div>
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
            </div>
            <div class="contact">
                <h3>Contact</h3>
                <div>
                    <label for="email">Email:</label>
                    <input name="email" type="email" value=[[user.contact.email]] on-input="onChange">
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
            <button on-click="saveUser">Save</button> 
            <button on-click="updateUser">Update</button> 
            <button on-click="clearForm">Clear</button> 
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

  uploadImage(e) {
    const file = e.target.files[0];
    this.readFileAsText(file)
      .then(result => {
        this.dispatchEvent(
          new CustomEvent("upload-image", {
            bubbles: true,
            composed: true,
            detail: {
              image: result
            }
          })
        );
      })
      .catch(err => {
        console.log("error uploading file", err);
      });
  }

  readFileAsText(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = e => {
        return resolve(reader.result);
      };
      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(file);
    });
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
      if (user[prop] === "undefined") {
        break;
      }
      if (typeof user[prop] === "string") {
        if (prop === name) {
          user[prop] = val;
          return true;
        }
      } else if (typeof user[prop] === "object") {
        const bool = this.findAndSetValue(user[prop], name, val);
        if (bool) {
          break;
        }
      }
    }
  }

  saveUser() {
    this.dispatchEvent(
      new CustomEvent("save-user", {
        bubbles: true,
        composed: true,
        detail: {
          user: this.user
        }
      })
    );
  }

  updateUser() {
    this.dispatchEvent(
      new CustomEvent("update-user", {
        bubbles: true,
        composed: true,
        detail: {
          user: this.user
        }
      })
    );
  }

  clearForm() {
    this.dispatchEvent(
      new CustomEvent("clear-form", {
        bubbles: true,
        composed: true
      })
    );
  }
}

window.customElements.define("user-form", userForm);
