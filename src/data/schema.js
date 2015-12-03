import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';


import {
  ScrapBoard,
  ScrapRow,
  ScrapItem,
  getScrapBoard,
  getScrapRow,
  getScrapRows,
  getScrapItem,
  getScrapItems,
  incItemClickcnt,
} from './database';


////////////////////////////////////////////
// nodeDefinitions

var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);

    if( type === 'ScrapBoard'){
      return getScrapBoard();
    } else if( type === 'ScrapRow'){
      return getScrapRow( id );
    } else if( type === 'ScrapItem'){
      return getScrapItem( id );
    } else {
      return null;
    }
  },
  (obj) => {

    if( obj instanceof ScrapBoard ){
      return scrapBoardType;
    }

    if( obj instanceof ScrapRow ){
      return scrapRowType;
    }

    if( obj instanceof ScrapItem ){
      return scrapItemType;
    }

  }
);

/******************************************/
// Types

let scrapItemType = new GraphQLObjectType({

  name: "ScrapItem",
  fields: () => ({
    id: globalIdField( 'ScrapItem' ),
    title: { type:GraphQLString, resolve: (obj)=> obj.title },
    ck_cnt: { type:GraphQLInt, resolve: (obj)=> obj.ck_cnt },
  }),
  interfaces: [nodeInterface]
});

var {connectionType: scrapItemConnection} =
  connectionDefinitions({name: 'ScrapItem', nodeType: scrapItemType});

let scrapRowType = new GraphQLObjectType({
  name:"ScrapRow",
  fields: () => ({
    id: globalIdField('ScrapRow'),
    title: { type:GraphQLString, resolve: (obj)=> obj.title },
    items: {
      type: scrapItemConnection,
      args: connectionArgs,
      resolve: ( row, args ) => connectionFromArray( getScrapItems(row.id), args ),
    },
  }),
  interfaces: [nodeInterface]
});

var {connectionType: scrapRowConnection} =
  connectionDefinitions({name: 'ScrapRow', nodeType: scrapRowType});


let scrapBoardType = new GraphQLObjectType({
  name:"ScrapBoard",
  fields: () => ({
    id: globalIdField('ScrapBoard'),
    title: { type: GraphQLString, resolve: (obj) => obj.title },
    rows: {
      type: scrapRowConnection,
      args: connectionArgs,
      resolve: ( row, args) => connectionFromArray( getScrapRows(), args ),
    },
  }),
  interfaces: [nodeInterface]
});


/******************************************/
// Mutation
let itemClickMutation = mutationWithClientMutationId({
  name: 'itemClick',
  inputFields:{
    id:{ type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields:{
    item:{
      type: scrapItemType,
      resolve: ({item}) => item,
    }
  },
  mutateAndGetPayload: ({id}) => {
    let localItemId = fromGlobalId( id ).id;
    return { item:incItemClickcnt( localItemId ) };
  }
});

let mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    itemClick: itemClickMutation,
  })
});

/******************************************/
// Query

let queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    scrapboard: {
      type:scrapBoardType,
      resolve: () => getScrapBoard()
    },
    node: nodeField
  })
});

/******************************************/
// Schema
export var schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
