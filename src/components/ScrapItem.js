import React from 'react';
import Relay from 'react-relay';

import ItemClickMutation from '../mutations/ItemClickMutation';

class ScrapItem extends React.Component {

  _ItemClick = () => {
    Relay.Store.update(
      new ItemClickMutation( { id: this.props.item.id, item: this.props.item } )
    );
  }

  render() {
    var {item} = this.props;
    return (
            <div onClick={this._ItemClick}>
              <h3>{item.title}</h3>
              <p>[[[ Click Count : {item.ck_cnt} ]]]</p>
            </div>
            );
  }
}

export default Relay.createContainer(ScrapItem, {
  fragments: {
    item: () => Relay.QL`
      fragment on ScrapItem {
        id,
        title,
        ck_cnt,
        ${ItemClickMutation.getFragment('item')},
      }
    `,
  },
});
