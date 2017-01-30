import React, { Component } from "react";
import Validate from "../validate/Validate";
import ValidateError from "../ui/Error.component";
import Errors from "../ui/Errors.component";

export class UserList extends Component {

  constructor() {
    super();
    this.state = {
      updateUser: Validate.createForm("updateUser", "userEdit"),
    };
  }

  componentWillMount() {
    Validate.subscribeToForm("updateUser", "ul", (updateUser) => {
      this.setState({ updateUser, });
    });
  }

  componentWillUnmount() {
    Validate.unsubscribe("ul");
  }

  // componentWillReceiveProps(newProps) {
  //   if (newProps.Users) {
  //     this.setState({
  //       Users: newProps.Users,
  //     });
  //   }
  // }

  handleChange(type, field, event) {
    if (type === "updateUser") {
      let value;
      if (field === "isActive" || field === "isRetired") {
        value = !Validate.getFormField("updateUser", field);
      } else {
        value = event.target.value;
      }
      Validate.updateForm("updateUser", field, value);
    }
  }

  handleClick(type, index, event) {
    if (type === "selectUser") {
      const Users = this.props.Users.filter(user => {
        if (user.isActive) return user;
      });
      Validate.replaceForm("updateUser", Users[index]);
    } else if (type === "update" && this.state.updateUser.values.id && Validate.isFormValid("updateUser")) {
      const user = Validate.getForm("updateUser").values;
      user.StudyField = this.props.StudyFields.find(field => {
        if (field.id.toString() === user.StudyFieldId) return field;
      });
      this.props.updateUser(user);
    }
  }

  // filterInactiveUsers(meetings) {
  //   const today = new Date();
  //   return meetings.filter(meeting => {
  //     const mdate = new Date(meeting.date);
  //     if (mdate >= today || mdate.toDateString() === today.toDateString()) {
  //       return meeting;
  //     }
  //   });
  // }

  render() {
    const activeUsers = this.props.Users.filter(user => {
      if (user.isActive) return user;
    });
    const { StudyFields } = this.props;
    const activeFields = StudyFields.filter(field => {
      if (field.isActive) return field;
    });
    const Users = activeUsers.map(user => {
      if (user.StudyFieldId) {
        user.StudyField = StudyFields.find(field => field.id === parseInt(user.StudyFieldId));
      }
      return user;
    })
    return (
      <div className="ui form">
        <div className="field">
          <h2 className="ui dividing header">Update user</h2>
          <div className="five fields">
            <div className="field">
              <label>Role</label>
              <select
                className="ui fluid search dropdown"
                value={this.state.updateUser.values.role}
                onChange={this.handleChange.bind(this, "updateUser", "role")}
              >
                <option value="instructor">Instructor</option>
                <option value="print-person">Print-person</option>
                <option value="professor">Professor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="field">
              <label>Studyfield</label>
              <select
                className="ui fluid search dropdown"
                value={this.state.updateUser.values.StudyFieldId || ""}
                onChange={this.handleChange.bind(this, "updateUser", "StudyFieldId")}
              >
                <option value="">None</option>
                { activeFields.map((field, index) =>
                  <option key={index} value={field.id}>
                    { field.name }
                  </option>
                )}
              </select>
            </div>
            <div className="field">
              <label>Firstname</label>
              <input
                type="text"
                placeholder="First name"
                value={this.state.updateUser.values.firstname}
                onChange={this.handleChange.bind(this, "updateUser", "firstname")}
              />
              <ValidateError errors={this.state.updateUser.errors} model="userEdit" field="firstname" />
            </div>
            <div className="field">
              <label>Lastname</label>
              <input
                type="text"
                placeholder="Last name"
                value={this.state.updateUser.values.lastname}
                onChange={this.handleChange.bind(this, "updateUser", "lastname")}
              />
              <ValidateError errors={this.state.updateUser.errors} model="userEdit" field="lastname" />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                type="text"
                placeholder="Email"
                value={this.state.updateUser.values.email}
                onChange={this.handleChange.bind(this, "updateUser", "email")}
              />
              <ValidateError errors={this.state.updateUser.errors} model="userEdit" field="email" />
            </div>
            <div className="field">
              <label>&nbsp;</label>
              <div className="ui checkbox">
                <input
                  type="checkbox"
                  checked={this.state.updateUser.values.isRetired ? "true" : ""}
                  onChange={this.handleChange.bind(this, "updateUser", "isRetired")}
                />
                <label>Retired</label>
              </div>
            </div>
            <div className="field">
              <label>&nbsp;</label>
              <button className="ui green button" onClick={this.handleClick.bind(this, "update")}>Update</button>
            </div>
          </div>
        </div>
        <h2 className="ui dividing header">Users</h2>
        <p>
          All registered and activated users. Setting an user inactive disables the account but doesn't delete it 
          from the database. Click on the user to edit.
        </p>
        <table className="ui celled table">
          <thead>
            <tr>
              <th onClick={this.handleClick.bind(this, "sort", "status")}>Role</th>
              <th onClick={this.handleClick.bind(this, "sort", "authorFirstname")}>Field</th>
              <th onClick={this.handleClick.bind(this, "sort", "authorLastname")}>Firstname</th>
              <th onClick={this.handleClick.bind(this, "sort", "authorLastname")}>Lastname</th>
              <th onClick={this.handleClick.bind(this, "sort", "title")}>Email</th>
              <th onClick={this.handleClick.bind(this, "sort", "studyfield")}>Retired</th>
            </tr>
          </thead>
          <tbody>
            { Users.map((item, index) =>
              <tr key={index} onClick={this.handleClick.bind(this, "selectUser", index)}>
                <td>{item.role}</td>
                <td>{item.StudyField ? item.StudyField.name : ""}</td>
                <td>{item.firstname}</td>
                <td>{item.lastname}</td>
                <td>{item.email}</td>
                <td>
                  <div className="ui checkbox">
                    <input
                      type="checkbox"
                      readOnly="true"
                      checked={item.isRetired ? "true" : ""}
                    />
                    <label></label>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }
}
import { connect } from "react-redux";
import { getUsers, updateUser } from "./user.actions";

const mapStateToProps = (state) => {
  const user_r = state.get("user");
  const studyfield_r = state.get("studyfield");
  return {
    Users: user_r.get("users").toJS(),
    StudyFields: studyfield_r.get("studyfields").toJS(),
  };
};

const mapDispatchToProps = (dispatch) => ({
  getUsers() {
    dispatch(getUsers());
  },
  updateUser(data) {
    dispatch(updateUser(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
