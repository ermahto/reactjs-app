import React from "react";

class LifecycleDemo extends React.Component {
  constructor(props) {
    super(props);
    console.log("Mounting: constructor");

    this.state = {
      count: 0,
      hasError: false
    };
  }

  // -------- MOUNTING + UPDATING --------
  static getDerivedStateFromProps(props, state) {
    console.log("Mounting/Updating: getDerivedStateFromProps");
    return null; // no state change
  }

  componentDidMount() {
    console.log("Mounting: componentDidMount");
  }

  // -------- UPDATING --------
  shouldComponentUpdate(nextProps, nextState) {
    console.log("Updating: shouldComponentUpdate");
    return true;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    console.log("Updating: getSnapshotBeforeUpdate");
    return "snapshot value";
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log("Updating: componentDidUpdate");
    console.log("Snapshot:", snapshot);
  }

  // -------- UNMOUNTING --------
  componentWillUnmount() {
    console.log("Unmounting: componentWillUnmount");
  }

  // -------- ERROR HANDLING --------
  static getDerivedStateFromError(error) {
    console.log("Error Handling: getDerivedStateFromError");
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log("Error Handling: componentDidCatch");
    console.log(error, info);
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  causeError = () => {
    throw new Error("Manual error triggered!");
  };

  render() {
    console.log("Render method");

    if (this.state.hasError) {
      return <h2>Something went wrong.</h2>;
    }

    return (
      <div style={{ fontFamily: "Arial", padding: "20px" }}>
        <h2>React Lifecycle Demo</h2>

        <p>Count: {this.state.count}</p>

        <button onClick={this.increment}>Update State</button>
        <button onClick={this.causeError} style={{ marginLeft: "10px" }}>
          Cause Error
        </button>
      </div>
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: true };
  }

  toggleComponent = () => {
    this.setState({ show: !this.state.show });
  };

  render() {
    return (
      <div>
        <button onClick={this.toggleComponent}>
          Mount / Unmount Component
        </button>

        {this.state.show && <LifecycleDemo />}
      </div>
    );
  }
}