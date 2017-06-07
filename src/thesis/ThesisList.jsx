/**
* ThesisList.smart for displaying the data relating to all the thesis added to the
* database. It contains the component for rendering the needed displayable data, and
* the container containing various functions for handling the connections between the
* component and Redux.
*/

import React, { Component } from "react";
import moment from "moment";
import ThesisListElement from "../thesis/ThesisListElement";
import _ from "lodash";

export class ThesisList extends Component {
  constructor() {
    super();
    this.state = {
      filteredTheses: [],
      selectedTheses: [],
      searchedTheses: [],
    };
  }

  componentWillMount() {
    this.props.getTheses();
    this.setState({
      filteredTheses: this.props.theses,
      selectedTheses: [],
      searchedTheses: [],
    });
  }

  componentWillReceiveProps(newProps) {
    // sort current and old theses since they seem to always be in disorder
    const currentTheses = this.props.theses.sort((a, b) => a.id - b.id)
    const newTheses = newProps.theses.sort((a, b) => a.id - b.id)
    // initState only when new theses have been received
    // this way user's filters/selects won't be altered by random actions
    if (!_.isEqual(currentTheses, newTheses)) {
      this.setState({
        filteredTheses: newProps.theses,
        selectedTheses: [],
        searchedTheses: [],
      });
    }
  }

  handleClick(name, event) {
    event.preventDefault();
    if (name === "download") {
      const IDs = this.state.filteredTheses.reduce((previousValue, currentValue, index) => {
        if (this.state.selectedTheses[index] && this.state.searchedTheses[index]) {
          return [...previousValue, currentValue.id];
        }
        return previousValue;
      }, []);
      this.props.downloadTheses({
        thesisIds: IDs
      });
    }
  }

  render() {
    return (
      <div>
        <div className="m-bot">
          <h2 className="ui dividing header">Theses</h2>
          <p>
            Past and current theses which you are allowed to view. Click on the thesis to select/unselect.
          </p>
          <button className="ui violet button" onClick={this.handleClick.bind(this, "download")}>Download selected</button>
        </div>
        <ThesisListElement
          theses={this.state.filteredTheses}
          selected={this.state.selectedTheses}
          searched={this.state.searchedTheses}
        />
      </div>
    );
  }
}

import { connect } from "react-redux";
import { getTheses, downloadTheses, } from "../thesis/thesis.actions";

const mapStateToProps = (state) => {
  const auth = state.get("auth");
  const thesis = state.get("thesis");
  return {
    theses: thesis.get("theses").toJS(),
    user: auth.get("user").toJS(),
  };
};

const mapDispatchToProps = (dispatch) => ({
  getTheses() {
    dispatch(getTheses());
  },
  downloadTheses(theses) {
    dispatch(downloadTheses(theses));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ThesisList);