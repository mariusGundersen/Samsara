import Icon from "../../components/icon.js";

export default ({users}) => (
  <div className="pane content">
    <h2><Icon of="cog" />Settings</h2>
    <div className="grid-container">
      <div className="box" data-viewmodel="UsersVM" data-model={JSON.stringify(users)}>
        <h3>
          <span>
            <Icon of="users" /> Users
          </span>
        </h3>
        <div className="box-list" data-bind="foreach:users">
          <div className="box-list-item">
            <label className="small-label" data-bind="text:username"></label>
            <div className="box-list-item-show" data-bind="visible:state()=='show', click:edit" style={{display: 'none'}}>
              <span className="control-like text-muted">(Click to change password)</span>
              <button className="pure-button button-minimal button-no-padding" data-bind="click:edit" title="Edit variable"><Icon of="pencil" /></button>
            </div>
            <form className="box-list-item-edit pure-form" data-bind="visible:state()=='editing'" style={{display: 'none'}}>
              <input data-bind="value:password" type="password" placeholder="new password"></input>
              <button className="pure-button button-success" type="submit" data-bind="click:save"><Icon of="check" /></button>
              <button className="pure-button" type="cancel" data-bind="click:cancel"><Icon of="close" /></button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
);
