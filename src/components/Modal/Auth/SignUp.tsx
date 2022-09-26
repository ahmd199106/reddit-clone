import { Input, Button, Flex, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtom';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/clientApp';

const SignUp: React.FC = () => {
  const setAuthModalState = useSetRecoilState(authModalState);

  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errorForm, setErrorForm] = useState('');
  const [createUserWithEmailAndPassword, user, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('credentials submitted');
    if (errorForm) setErrorForm('');

    //check if password and conform password match
    // if (signUpForm.password !== signUpForm.confirmPassword) {
    //   console.log(signUpForm.email);
    //   console.log(signUpForm.password);
    //   console.log('confirmpassword', signUpForm.confirmPassword);
    //   setErrorForm('Passwords do not match');
    //   console.log('passwords not matching why');
    //   return;
    // }
    console.log('passwords match');
    createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
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
        name='confirmPassword'
        type='password'
        placeholder='confirm password'
        onChange={onChange}
      />
      {errorForm ||
        (userError && (
          <Text color='red.500' textAlign='center'>
            {errorForm || userError.message}
          </Text>
        ))}
      <Button
        type='submit'
        width='100%'
        height='36px'
        my={2}
        isLoading={loading}
      >
        Sign Up
      </Button>
      <Flex fontSize='9pt' justifyContent='center'>
        <Text mr={2}>Already a Redditor?</Text>
        <Text
          color='blue.500'
          fontWeight='bold'
          cursor='pointer'
          onClick={() => {
            setAuthModalState((prev) => ({
              ...prev,
              view: 'login',
            }));
          }}
        >
          LOG IN
        </Text>
      </Flex>
    </form>
  );
};

export default SignUp;
