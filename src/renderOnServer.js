import GraphQLStoreChangeEmitter from 'react-relay/lib/GraphQLStoreChangeEmitter';
import IsomorphicRelay from 'isomorphic-relay';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Relay from 'react-relay';
import rootContainerProps from './rootContainerProps';


const GRAPHQL_URL = `http://localhost:8080/graphql`;

Relay.injectNetworkLayer(new Relay.DefaultNetworkLayer(GRAPHQL_URL));

GraphQLStoreChangeEmitter.injectBatchingStrategy(() => {});

export default (res, next) => {
    IsomorphicRelay.prepareData(rootContainerProps).then(data => {
        const reactOutput = ReactDOMServer.renderToString(
            <IsomorphicRelay.RootContainer {...rootContainerProps} />
        );
        res.render(path.resolve(__dirname, '..', 'views', 'index.ejs'), {
            preloadedData: JSON.stringify(data),
            reactOutput
        });
    }, next);
}