import React from 'react';
import Relay from 'react-relay';
import ScrapItem from './ScrapItem';

class ScrapRow extends React.Component {

  render() {
    var {row} = this.props;
    return (
            <div>
              <div><h2>{row.title}</h2></div>
              {row.items.edges.map(edge => (
                <div key={edge.node.id}  >
                  <p>{edge.node.title}</p>
                  <ScrapItem item={edge.node} />
                </div>
              ))}
            </div>
            );
  }
}

export default Relay.createContainer(ScrapRow, {
  fragments: {
    row: () => Relay.QL`
      fragment on ScrapRow {
        title
        items(first:10){
          edges{
            node{
              id,
              ${ScrapItem.getFragment('item')}
            }
          }
        }
      }
    `,
  },
});
