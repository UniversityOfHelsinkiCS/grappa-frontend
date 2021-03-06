import chai, { expect } from "chai";
import jsxChai from "jsx-chai";
chai.use(jsxChai);
import sinon from "sinon";
import React from "react";
import {
  renderIntoDocument,
  scryRenderedDOMComponentsWithClass,
  Simulate,
} from "react-addons-test-utils";
import { Provider } from "react-redux";
import store from "../../src/store";
import ThesisCreatePageContainer from "../../src/thesis/ThesisCreatePage";
import * as actions from "../../src/thesis/thesis.actions";

describe("ThesisCreatePage", () => {
  const component = renderIntoDocument(
    <Provider store={store}>
      <ThesisCreatePageContainer />
    </Provider>
  );

  xit("should call method saveThesis when submit is clicked", (done) => {
    const form = scryRenderedDOMComponentsWithClass(component, "ui form")[0];

    const spymethod = sinon.spy(actions, "saveThesis");
    Simulate.submit(form);
    expect(spymethod.callCount).to.equal(1); // should be 1

    done();
  });

  xdescribe("ThesisCreatePage form validation", () => {
    const button = scryRenderedDOMComponentsWithClass(component, "ui primary button")[1];
    it("should keep submit button locked until all fields are filled", () => {
      expect(button.disabled).to.equal(true);
    });
  });
});
