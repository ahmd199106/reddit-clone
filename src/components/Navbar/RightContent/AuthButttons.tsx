import { Button, Flex } from '@chakra-ui/react';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtom';

type AuthButttonsProps = {};

const AuthButttons: React.FC<AuthButttonsProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  return (
    <>
      <Flex justify='center' align='center'>
        <Button
          variant='outline'
          display={{ base: 'none', sm: 'flex' }}
          height='28px'
          width={{ base: '70px', md: '110px' }}
          mr={2}
          onClick={() => {
            setAuthModalState({ open: true, view: 'login' });
          }}
        >
          Log in
        </Button>
        <Button
          height='28px'
          display={{ base: 'none', sm: 'flex' }}
          width={{ base: '70px', md: '110px' }}
          mr={2}
          onClick={() => {
            setAuthModalState({ open: true, view: 'signup' });
          }}
        >
          Sign Up
        </Button>
      </Flex>
    </>
  );
};
export default AuthButttons;
