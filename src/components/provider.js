import React from "react";
import PropTypes from "prop-types";

const contextTypes = {
  blinkloader: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    token:  PropTypes.string
  })
};

class BlinkloaderProvider extends React.Component {
  static childContextTypes = contextTypes;
  static propTypes = {
    userId:   PropTypes.string.isRequired,
    token:    PropTypes.string,
    children: PropTypes.node
  };

  static defaultProps = {
    children: null
  };

  getChildContext() {
    return { blinkloader: this.props };
  }

  render() {
    return this.props.children;
  }
}

export default BlinkloaderProvider;
