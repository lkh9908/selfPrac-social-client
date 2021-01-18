import React from 'react'
import App from './App'
import { ApolloClient } from '@apollo/client/apollo-client.cjs'
import { InMemoryCache } from '@apollo/client'
import { createHttpLink } from '@apollo/client'
import { ApolloProvider } from '@apollo/react-hooks'
import { setContext } from 'apollo-link-context'

const httpLink = createHttpLink({
    uri: 'https://peaceful-river-47844.herokuapp.com/'
})

const authLink  = setContext (() => {
    const token = localStorage.getItem('jwtToken')
    return{
        headers: {
            Authorization: token ? `Bearer ${token}` : ''
        }
    }
})

// solving the "Cache data may be lost when replacing" issue from LikeButton
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
        typePolicies: {
            Post: {
                fields: {
                    likes: {
                        merge(existing, incoming) {
                            return incoming;
                        }
                    }
                }
            }
        }
    })
})

export default (
    <ApolloProvider client = {client}>
        <App/>
    </ApolloProvider>
)