import { Flex, Button, Image, Text } from '@chakra-ui/react';
import React from 'react';
import {
  useSignInWithGoogle,
  useSignInWithApple,
} from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/clientApp';

type OAuthButtonsProps = {};

const OAuthButtons: React.FC<OAuthButtonsProps> = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const [signInWithApple, appleUser, appleLoading, appleError] =
    useSignInWithApple(auth);

  return (
    <Flex direction='column' width='100%' mb={1}>
      <Button
        variant='oauth'
        width='100%'
        mb={4}
        onClick={() => signInWithGoogle()}
      >
        <Image
          src='/images/googlelogo.png'
          alt='google logo'
          height='20px'
          mr={4}
        />
        Continue with Google
      </Button>
      {error && <Text>{error.message}</Text>}
      <Button
        variant='oauth'
        width='100%'
        mb={4}
        onClick={() => signInWithApple()}
      >
        Continue with Apple
      </Button>
      {!user && appleError && <Text>{appleError.message}</Text>}
    </Flex>
  );
};
export default OAuthButtons;
