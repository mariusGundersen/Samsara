import React from 'react';

export default ({message = ''}) => <div className="pane content">
  <h1 className="hero"><img src="/images/logo.svg" className="logo" />Samsara</h1>

  <div className="grid-container">
    <section className="box">
      <form className="pure-form pure-form-stacked box-form" action="/login" method="post">
      <span className="validation-error-message">{message}</span>
        <label className="small-label">Username</label>
        <input type="text" name="username" id="username" autofocus />

        <label className="small-label">Password</label>
        <input type="password" name="password" id="password" />

        <div className="button-group">
          <button type="submit" className="pure-button button-success">
            <i className="fa fa-fw fa-check"></i>
            Log in
          </button>
        </div>
      </form>
    </section>
  </div>
</div>;
