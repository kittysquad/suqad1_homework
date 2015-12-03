import Relay from 'react-relay';

export default class ItemClickMutation extends Relay.Mutation {
  static fragments = {
    item: () => Relay.QL`
      fragment on ScrapItem {
      	id,
        ck_cnt,
      }
    `,
  };
  
  getMutation() {
    return Relay.QL`mutation{itemClick}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on itemClickPayload {
        item{
        	id,
        	ck_cnt,
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs:{
      	item: this.props.item.id,
      }
    }];
  }
  getVariables() {
    return {
      id: this.props.id,
    };
  }

}