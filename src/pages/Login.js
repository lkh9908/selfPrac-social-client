import React, { useContext, useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import  { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { PromiseProvider } from 'mongoose'


import {AuthContext} from '../context/auth'

import { useForm } from '../util/hooks'

function Login(props){
    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({})

    const { onChange, onSubmit, values } = useForm(LoginUser, {
        userName: '',
        password: ''
    })

    const [login, { loading }] = useMutation(LOGIN_USER, {
        update(_, { data: {login: userData}}){
            // console.log(result)
            context.login(userData)
            props.history.push('/')
        },
        onError(err){
            // console.log(err.graphQLErrors[0].extensions.exception.errors)
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables: values
    })

    function LoginUser(){
        login()
    }

    return(
        <div className = "form-container">
            <Form onSubmit = {onSubmit} noValidate className = {loading ? "loading" : ''}>
                <h1>Login</h1>
                <Form.Input
                    label = "UserName"
                    placeholder = "Enter your username"
                    name = "userName"
                    type = "text"
                    value = {values.username}
                    error = {errors.userName ? true : false}
                    onChange = {onChange}
                />
                <Form.Input
                    label = "Password"
                    placeholder = "Enter your Password"
                    name = "password"
                    type = "password"
                    value = {values.password}
                    error = {errors.password ? true : false}
                    onChange = {onChange}
                />
                <Button type="submit" primary>
                    Login
                </Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className = 'ui error message'>
                <ul className = "list">
                    {Object.values(errors).map(value => (
                        <li key={value}>{value}</li>
                    ))}
                </ul>
            </div>
            )}
        </div>
    )
}

// gql Mutation
const LOGIN_USER = gql`
  mutation login(
    $userName: String!
    $password: String!
  ) {
    login(
        userName: $userName
        password: $password
    ) {
      id
      email
      userName
      createdAt
      token
    }
  }
`;
export default Login