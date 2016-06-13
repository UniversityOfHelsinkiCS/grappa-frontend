/**
* ThesisCreate.smart for displaying and running the feature for adding thesis,
* which contains the ThesisCreate component for creating the visual side
* of the page and the container containing functions for connecting the component
* to the reducers that handle the actual changes to the state.
*/

import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import Errors from "../ui/Errors.component";
// import Dropdown from "../ui/Dropdown.component";
// import Validation from "./thesisValidation";
import { validateField, validateModel } from "../config/Validator";

export class ThesisCreate extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      authorFirstname: "",
      authorLastname: "",
      authorEmail: "",
      title: "",
      graders: [
        {
          name: "",
          title: "",
        },
        {
          name: "",
          title: "",
        },
      ],
      urkund: "",
      ethesis: "",
      grade: "",
      StudyFieldId: "",
      CouncilMeetingId: "",
      errors: {},
    };
  }

  componentDidMount() {
    this.props.getCouncilmeetings();
    this.props.getStudyfields();
  }

  /**
  * Handler method to handle changes happening in the different input fields in the render method.
  * @param name The id for where the change has happened. Used to designated which state parameter changes.
  * @param event Used to get a hold of what the input of the user was.
  * @param type Type of validation needed: text, email or link
  */
  handleChange(name, event) {
    console.log(name);
    event.preventDefault();
    const change = {
      errors: this.state.errors,
    };
    change[name] = event.target.value;
    console.log(change);
    const newErrors = validateField(name, event.target.value, "thesis");
    console.log(newErrors);
    change.errors[`thesis_${name}`] = newErrors;
    this.setState(change);
  }

  handleGraderChange(index, name, event) {
    event.preventDefault();
    const change = {
      graders: this.state.graders,
      errors: this.state.errors,
    };
    console.log(this.state.errors);
    change.graders[index][name] = event.target.value;
    const newErrors = validateField(name, event.target.value, "grader");
    console.log(newErrors);
    change.errors[`grader_${name}`] = newErrors;
    this.setState(change);
  }

  addGrader(event) {
    event.preventDefault();
    const newGrader = {
      name: "",
      title: "",
    };
    const change = {
      graders: [...this.state.graders, newGrader],
      errors: this.state.errors,
    };
    const newErrors = validateField("graders", change.graders, "thesis");
    console.log(newErrors);
    change.errors.thesis_graders = newErrors;
    this.setState(change);
  }

  removeGrader(index, event) {
    event.preventDefault();
    this.state.graders.splice(index, 1);
    const change = {
      graders: this.state.graders,
      errors: this.state.errors,
    };
    const newErrors = validateField("graders", change.graders, "thesis");
    console.log(newErrors);
    change.errors.thesis_graders = newErrors;
    this.setState(change);
  }
  /**
   * Handler method to handle what to do when the submit button is clicked.
   * @param event Used to get a hold of what the input of the user was.
   */
  handleSubmit(event) {
    event.preventDefault();
    const thesisErrors = validateModel(this.state, "thesis");
    // const graderErrors = validateModel(this.state.graders, "grader");
    // console.log(thesisErrors);
    if (thesisErrors.list.length === 0) {
      const newThesis = {
        authorFirstname: this.state.authorFirstname,
        authorLastname: this.state.authorLastname,
        authorEmail: this.state.authorEmail,
        title: this.state.title,
        graders: this.state.graders,
        urkund: this.state.urkund,
        grade: this.state.grade,
        StudyFieldId: this.state.StudyFieldId,
        CouncilMeetingId: this.state.CouncilMeetingId,
      };
      this.props.saveThesis(newThesis);
    } else {
      this.setState({ errors: thesisErrors.obj });
    }
  }

  renderThesisAuthor() {
    return (
      <div className="m-bot">
        <p>
          Please fill in all the fields. Thesis has to have a minimun of two graders and if
          one of them isn't at least a professor and the other a doctor an evaluation of
          the graders will be done by the thesis' studyfield's professor.
        </p>
        <h3 className="ui dividing header">Thesis Author</h3>
        <div className="three fields">
          <div className="field">
            <label>First name</label>
            <input
              type="text"
              value={this.state.firstname}
              onChange={this.handleChange.bind(this, "authorFirstname")}
              placeholder="First Name"
            />
          </div>
          <div className="field">
            <label>Last name</label>
            <input
              type="text"
              value={this.state.lastname}
              onChange={this.handleChange.bind(this, "authorLastname")}
              placeholder="Last Name"
            />
          </div>
          <div className="field">
            <label>Email</label>
            <input
              type="text"
              value={this.state.email}
              onChange={this.handleChange.bind(this, "authorEmail")}
              placeholder="Email Address"
            />
          </div>
        </div>
      </div>
    );
  }

  renderThesisInformation() {
    console.log(this.props.studyfields);
    return (
      <div className="m-bot">
        <h3 className="ui dividing header">Thesis Information</h3>
        <div className="three fields">
          <div className="field">
            <label>Title</label>
            <input
              type="text"
              value={this.state.title}
              onChange={this.handleChange.bind(this, "title")}
              placeholder="Title"
            />
          </div>
          <div className="field">
            <label>Studyfield</label>
            <select
              className="ui fluid search dropdown"
              onChange={this.handleChange.bind(this, "StudyFieldId")}
            >
              <option key="0" value="">Select field</option>
              { this.props.studyfields.map((field, index) =>
                <option key={index} value={field.id}>
                  { field.name }
                </option>
              )}
            </select>
          </div>
          <div className="field">
            <label>Grade</label>
            <select
              className="ui fluid search dropdown"
              value={this.state.grade}
              onChange={this.handleChange.bind(this, "grade")}
            >
              <option value="">Select grade</option>
              <option value="Approbatur">Approbatur</option>
              <option value="Lubenter Approbatur">Lubenter Approbatur</option>
              <option value="Non Sine Laude Approbatur">Non Sine Laude Approbatur</option>
              <option value="Cum Laude Approbatur">Cum Laude Approbatur</option>
              <option value="Magna Cum Laude Approbatur">Magna Cum Laude Approbatur</option>
              <option value="Eximia Cum Laude Approbatur">Eximia Cum Laude Approbatur</option>
              <option value="Laudatur">Laudatur</option>
            </select>
          </div>
        </div>
        <div className="three fields">
          <div className="field">
            <label>Urkund-link</label>
            <input
              type="text"
              value={this.state.urkund}
              onChange={this.handleChange.bind(this, "urkund")}
              placeholder="Link to Urkund"
            />
          </div>
        </div>
      </div>
    );
  }

  renderGraders() {
    return (
      <div className="m-bot">
        <h3 className="ui dividing header">Graders</h3>
        {
          this.state.graders.map((grader, index) =>
            <div key={index} className="three fields">
              <div className="field">
                <label>Name</label>
                <input type="text" name="grader_name" value={grader.name} onChange={this.handleGraderChange.bind(this, index, "name")} placeholder="Name" />
              </div>
              <div className=" field">
                <label>Title</label>
                <select className="ui fluid search dropdown" value={grader.title} onChange={this.handleGraderChange.bind(this, index, "title")} >
                  <option value="">Select title</option>
                  <option value="Prof">Professor</option>
                  <option value="AssProf">Assistant Professor</option>
                  <option value="AdjProf">Adjunct Professor</option>
                  <option value="Doc">Doctor</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="field">
                <label>&nbsp;</label>
                <button className="ui red button" onClick={this.removeGrader.bind(this, index)}>Remove Grader</button>
              </div>
            </div>
          )
        }
        <button className="ui primary button" onClick={this.addGrader.bind(this)}>Add Grader</button>
      </div>
    );
  }

  formatMeetingsForReactTable(meetings) {
    return meetings.map(meeting => {
      return {
        date: moment(new Date(meeting.date)).format("DD/MM/YYYY"),
      };
    });
  }

  filterOldDates(meetings) {
    const today = new Date();
    return meetings.filter(meeting => {
      if (new Date(meeting.date) > today) {
        return meeting;
      }
    });
  }

  renderPickCouncilmeeting() {
    console.log(this.props.meetingDates);
    const today = new Date();
    const filtered = this.props.meetingDates.filter(meeting => {
      if (new Date(meeting.date) >= today) {
        return meeting;
      }
    });
    const formatted = filtered.map(meeting => {
      return {
        id: meeting.id,
        date: moment(new Date(meeting.date)).format("DD/MM/YYYY"),
      };
    });
    const meetingDates = [{ id: "", date: "Select Date" }, ...formatted];
    return (
      <div className="m-bot">
        <h3 className="ui dividing header">Choose the Councilmeeting date</h3>
        <select className="ui fluid search dropdown"
          onChange={this.handleChange.bind(this, "CouncilMeetingId")}
        >
          { meetingDates.map((meeting, index) =>
            <option key={ index } value={ meeting.id } >
              { meeting.date }
            </option>
          )}
        </select>
      </div>
    );
  }

/**
* The method in charge of rendering the outlook of the page. Contains all the html elements.
* @return <div> thesis-container Container wrapping all the html elements to be rendered.
*/
  render() {
    return (
      <div>
        <div className="ui form">
          <h2 className="ui dividing header">Create a thesis</h2>
          {this.renderThesisAuthor()}
          {this.renderThesisInformation()}
          {this.renderGraders()}
          {this.renderPickCouncilmeeting()}
        </div>
        <Errors errors={this.state.errors}/>
        <button className="ui primary button" onClick={this.handleSubmit}>
          Submit
        </button>
      </div>
    );
  }
}

import { saveThesis } from "./thesis.actions";
import { getCouncilmeetings } from "../councilmeeting/councilmeeting.actions";
import { getStudyfields } from "../studyfield/studyfield.actions";

const mapDispatchToProps = (dispatch) => ({
  saveThesis(newThesis) {
    dispatch(saveThesis(newThesis));
  },
  getCouncilmeetings() {
    dispatch(getCouncilmeetings());
  },
  getStudyfields() {
    dispatch(getStudyfields());
  },
});

const mapStateToProps = (state) => {
  const cmreducer = state.get("councilmeeting");
  const sfreducer = state.get("studyfield");
  return {
    meetingDates: cmreducer.get("councilmeetings").toJS(),
    studyfields: sfreducer.get("studyfields").toJS(),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ThesisCreate);
