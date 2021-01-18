import React, { useContext, useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import  { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
// import { PromiseProvider } from 'mongoose'

import { AuthContext } from '../context/auth'
import { useForm } from '../util/hooks'

function Register(props){
    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({})

    const { onChange, onSubmit, values } = useForm(registerUser, {
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, {data: {register: userData}}){
            context.login(userData)
            // console.log(result)
            props.history.push('/')
        },
        onError(err){
            // console.log(err.graphQLErrors[0].extensions.exception.errors)
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables: values
    })

    function registerUser(){
        addUser()
    }

    return(
        <div className = "form-container">
            <Form onSubmit = {onSubmit} noValidate className = {loading ? "loading" : ''}>
                <h1>Sign Up</h1>
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
                    label = "Email"
                    placeholder = "Enter your email"
                    name = "email"
                    type = "email"
                    value = {values.email}
                    error = {errors.email ? true : false}
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
                <Form.Input
                    label = "Confirm Password"
                    placeholder = "Re-enter your Password"
                    name = "confirmPassword"
                    type = "password"
                    value = {values.confirmPassword}
                    error = {errors.confirmPassword ? true : false}
                    onChange = {onChange}
                />
                <Button type="submit" primary>
                    Sign Up
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
const REGISTER_USER = gql`
  mutation register(
    $userName: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        userName: $userName
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      userName
      createdAt
      token
    }
  }
`;
export default Register