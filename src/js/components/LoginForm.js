// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

import Button from './Button';
import CheckBox from './CheckBox';
import FormattedMessage from './FormattedMessage';
import Form from './Form';
import FormField from './FormField';
import Footer from './Footer';
import Heading from './Heading';

import CSSClassnames from '../utils/CSSClassnames';

const CLASS_ROOT = CSSClassnames.LOGIN_FORM;

export default class LoginForm extends Component {

  constructor(props, context) {
    super(props, context);

    this._onSubmit = this._onSubmit.bind(this);
    this._onUsernameChange = this._onUsernameChange.bind(this);
    this._onPasswordChange = this._onPasswordChange.bind(this);
    this._onRememberMeChange = this._onRememberMeChange.bind(this);

    this.state = {
      password: '',
      rememberMe: props.defaultValues.rememberMe,
      username: props.defaultValues.username
    };
  }

  componentDidMount () {
    if (this.usernameRef) {
      this.usernameRef.focus();
    }
  }

  _onUsernameChange (event) {
    this.setState({ username: event.target.value });
  }

  _onPasswordChange (event) {
    this.setState({ password: event.target.value });
  }

  _onRememberMeChange (event) {
    this.setState({ rememberMe: event.target.checked });
  }

  _onSubmit (event) {
    event.preventDefault();
    const { onSubmit } = this.props;
    let { password, rememberMe, username } = this.state;

    username = username.trim();
    password = password.trim();

    if (onSubmit) {
      onSubmit({username, password, rememberMe});
    }
  }

  render () {
    const {
      align, className, errors, forgotPassword,
      logo, onSubmit, rememberMe, secondaryText, title, usernameType
    } = this.props;

    let classes = classnames(
      CLASS_ROOT,
      className, {
        [`${CLASS_ROOT}--align-${align}`]: align
      }
    );

    let errorsNode = errors.map((error, index) => {
      let errorComponent;
      if (error) {
        errorComponent = (
          <div key={index} className='error'>
            <FormattedMessage id={error} defaultMessage={error} />
          </div>
        );
      }
      return errorComponent;
    });

    let titleNode;
    if (title) {
      titleNode = (
        <Heading strong={true}>
          {title}
        </Heading>
      );
    }

    let secondaryTextNode;
    if (secondaryText) {
      secondaryTextNode = (
        <p className={`${CLASS_ROOT}__secondary-text secondary`}>
          {secondaryText}
        </p>
      );
    }

    let rememberMeNode;
    if (rememberMe) {
      const rememberMeLabel = (
        <FormattedMessage id='Remember me' defaultMessage='Remember me' />
      );

      rememberMeNode = (
        <CheckBox label={rememberMeLabel} checked={this.state.rememberMe}
          onChange={this._onRememberMeChange} />
      );
    }

    const username = usernameType === 'email' ? (
      <FormattedMessage id='Email' defaultMessage='Email' />
    ) : (
      <FormattedMessage id='Username' defaultMessage='Username' />
    );

    const password = (
      <FormattedMessage id='Password' defaultMessage='Password' />
    );
    const login = <FormattedMessage id='Log In' defaultMessage='Log In' />;

    return (
      <Form className={classes} onSubmit={this._onSubmit}>
        <div className={`${CLASS_ROOT}__header`}>
          {logo}
          {titleNode}
          {secondaryTextNode}
        </div>
        <fieldset>
          <FormField htmlFor='username' label={username}>
            <input type={usernameType} ref={ref => this.usernameRef = ref}
              value={this.state.username}
              onChange={this._onUsernameChange} />
          </FormField>
          <FormField htmlFor='password' label={password}>
            <input type='password' value={this.state.password}
              onChange={this._onPasswordChange} />
          </FormField>
          {errorsNode}
        </fieldset>
        <Footer align={align} size='small' direction='column'
          pad={{vertical: 'medium', between: 'medium'}}>
          {rememberMeNode}
          <Button primary={true} strong={true}
            className={`${CLASS_ROOT}__submit`} type='submit' label={login}
            onClick={onSubmit ? this._onSubmit : undefined} />
          {forgotPassword}
        </Footer>
      </Form>
    );
  }

}

LoginForm.propTypes = {
  align: PropTypes.oneOf(['start', 'center', 'end', 'stretch']),
  className: PropTypes.string,
  defaultValues: PropTypes.shape({
    username: PropTypes.string,
    rememberMe: PropTypes.bool
  }),
  errors: PropTypes.arrayOf(PropTypes.string),
  forgotPassword: PropTypes.node,
  logo: PropTypes.node,
  onSubmit: PropTypes.func,
  rememberMe: PropTypes.bool,
  secondaryText: PropTypes.string,
  title: PropTypes.string,
  usernameType: PropTypes.string
};

LoginForm.defaultProps = {
  defaultValues: {
    username: '',
    rememberMe: false
  },
  errors: [],
  usernameType: 'email'
};
