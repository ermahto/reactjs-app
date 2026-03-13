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










import React, { Component } from "react";

class ErrorBoundaryExample extends Component {

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log("Error caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong.</h2>;
    }

    return this.props.children;
  }
}

export default ErrorBoundaryExample;








import React from "react";

function BuggyComponent() {
  throw new Error("Example Error!");
}

export default BuggyComponent;





import ErrorBoundaryExample from "./ErrorBoundaryExample";
import BuggyComponent from "./BuggyComponent";

function App() {
  return (
    <ErrorBoundaryExample>
      <BuggyComponent />
    </ErrorBoundaryExample>
  );
}







import React, { PureComponent } from "react";

class PureComponentExample extends PureComponent {

  render() {
    console.log("PureComponent Rendered");

    return (
      <div>
        <h3>Count: {this.props.count}</h3>
      </div>
    );
  }
}

export default PureComponentExample;






import React, { Component } from "react";
import PureComponentExample from "./PureComponentExample";

class PureComponentParent extends Component {

  state = { count: 0 };

  increase = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div>
        <button onClick={this.increase}>Increase</button>
        <PureComponentExample count={this.state.count} />
      </div>
    );
  }
}

export default PureComponentParent;









import React, { Component, createRef } from "react";

class ReferenceExample extends Component {

  constructor(props) {
    super(props);

    // Method 1: createRef
    this.inputRef = createRef();
  }

  focusInput = () => {
    this.inputRef.current.focus();
  };

  render() {
    return (
      <div>
        <input ref={this.inputRef} placeholder="Type here..." />
        <button onClick={this.focusInput}>Focus Input</button>
      </div>
    );
  }
}

export default ReferenceExample;







Other Reference Types

1. Callback Ref

<input ref={(input) => (this.inputElement = input)} />

2. useRef (Functional Component)

File: UseRefExample.jsx

import React, { useRef } from "react";

function UseRefExample() {

  const inputRef = useRef(null);

  const handleFocus = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={handleFocus}>Focus</button>
    </div>
  );
}

export default UseRefExample;





import React from "react";
import ErrorBoundaryExample from "./examples/ErrorBoundaryExample";
import BuggyComponent from "./examples/BuggyComponent";
import PureComponentParent from "./examples/PureComponentParent";
import ReferenceExample from "./examples/ReferenceExample";
import UseRefExample from "./examples/UseRefExample";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>React Concept Examples</h1>

      <h2>Error Boundary Example</h2>
      <ErrorBoundaryExample>
        <BuggyComponent />
      </ErrorBoundaryExample>

      <h2>Pure Component Example</h2>
      <PureComponentParent />

      <h2>Reference Example (createRef)</h2>
      <ReferenceExample />

      <h2>Reference Example (useRef)</h2>
      <UseRefExample />

    </div>
  );
}

export default App;












import React, { Component } from "react";

class LifecycleClassExample extends Component {

  constructor(props) {
    super(props);
    this.state = { count: 0 };
    console.log("Constructor called");
  }

  componentDidMount() {
    console.log("Component Did Mount");
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("Component Did Update");
  }

  componentWillUnmount() {
    console.log("Component Will Unmount");
  }

  increase = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div>
        <h3>Class Component</h3>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increase}>Increase</button>
      </div>
    );
  }
}

export default LifecycleClassExample;








import React, { useState, useEffect } from "react";

function LifecycleFunctionExample() {

  const [count, setCount] = useState(0);

  // componentDidMount
  useEffect(() => {
    console.log("Component Did Mount");

    return () => {
      console.log("Component Will Unmount");
    };
  }, []);

  // componentDidUpdate
  useEffect(() => {
    console.log("Component Did Update");
  }, [count]);

  return (
    <div>
      <h3>Functional Component</h3>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increase</button>
    </div>
  );
}

export default LifecycleFunctionExample;






import React, { Component } from "react";

class ErrorBoundaryExample extends Component {

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    console.log("Error caught:", error);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <h2>Error occurred in child component</h2>;
    }

    return this.props.children;
  }
}

export default ErrorBoundaryExample;





import React, { useState } from "react";
import LifecycleClassExample from "./LifecycleClassExample";
import LifecycleFunctionExample from "./LifecycleFunctionExample";

function App() {

  const [show, setShow] = useState(true);

  return (
    <div style={{ padding: "20px" }}>
      <h1>React Lifecycle Comparison</h1>

      <button onClick={() => setShow(!show)}>
        Toggle Component
      </button>

      {show && <LifecycleClassExample />}
      {show && <LifecycleFunctionExample />}

    </div>
  );
}

export default App;





















