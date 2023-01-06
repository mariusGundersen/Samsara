import nth from "../../private/nthLife.js";

export default ({spirits}) => (
  <div className="pane content">
    <h2>Spirits</h2>
    <ul className="pure-menu-list">
      {spirits.map(spirit => (
        <li className="pure-menu-item">
          <a href={`/spirit/${spirit.name}`} className="pure-menu-link">{spirit.name} <span className="text-faded">({nth(spirit.life)} life)</span></a>
        </li>
      ))}
    </ul>
  </div>
);
