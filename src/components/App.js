import React from 'react';
import Relay from 'react-relay';
import ScrapRow from './ScrapRow';

class App extends React.Component {
  render() {
    var {scrapboard} = this.props;
    return (
      <div>
        <div><h1>{scrapboard.title}</h1></div>
        {scrapboard.rows.edges.map(edge => (
          <div key={edge.node.id}>
            <p>{edge.node.title}</p>
            <ScrapRow row={edge.node} />
          </div>
        ))}
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    scrapboard: () => Relay.QL`
      fragment on ScrapBoard {
        title,
        rows(first:10){
          edges{
            node{
              id,
              ${ScrapRow.getFragment('row')}
            }
          }
        }
      }
    `
  },
});