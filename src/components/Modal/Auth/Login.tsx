import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtom';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/clientApp';

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const onSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log('credentials submitted');
    signInWithEmailAndPassword(loginForm.email, loginForm.password);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <Input
          required
          fontSize='10pt'
          _placeholder={{ placeholdercolor: 'gray.500' }}
          _hover={{
            bg: 'white',
            outline: 'none',
            border: '1px solid',
            borderColor: 'blue.500',
          }}
          bg='gray.200'
          mb={2}
          name='email'
          type='email'
          placeholder='email'
          onChange={onChange}
          //   value={loginForm.email}
        />
        <Input
          required
          fontSize='10pt'
          _placeholder={{ placeholdercolor: 'gray.500' }}
          _hover={{
            bg: 'white',
            outline: 'none',
            border: '1px solid',
            borderColor: 'blue.500',
          }}
          bg='gray.200'
          mb={2}
          name='password'
          type='password'
          placeholder='password'
          onChange={onChange}
          //   value={loginForm.password}
        />
        {error && (
          <Text color='red.500' textAlign='center' fontSize='10pt'>
            {error.message}
          </Text>
        )}
        <Button
          type='submit'
          width='100%'
          height='36px'
          my={2}
          isLoading={loading}
        >
          Log In
        </Button>
        <Flex justifyContent='center' mb={2}>
          <Text fontSize='9pt' mr={1}>
            Forgot your password?
          </Text>
          <Text
            fontSize='9pt'
            color='blue.500'
            cursor='pointer'
            onClick={() => {
              setAuthModalState((prev) => ({
                ...prev,
                view: 'resetPassword',
              }));
            }}
          >
            Reset
          </Text>
        </Flex>
        <Flex fontSize='9pt' justifyContent='center'>
          <Text mr={2}>New here?</Text>
          <Text
            color='blue.500'
            fontWeight='bold'
            cursor='pointer'
            onClick={() => {
              setAuthModalState((prev) => ({
                ...prev,
                view: 'signup',
              }));
            }}
          >
            SIGN UP
          </Text>
        </Flex>
      </form>
    </>
  );
};

export default Login;
