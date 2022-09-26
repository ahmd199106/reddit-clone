import { Button, Flex, Text } from '@chakra-ui/react';
import { signOut, User } from 'firebase/auth';
import React from 'react';
import { auth } from '../../../firebase/clientApp';
import AuthModal from '../../Modal/Auth/AuthModal';
import AuthButtons from './AuthButttons';
import Icons from './Icons';
import UserMenu from './UserMenu';

type RightContentProps = {
  user?: User | null;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  return (
    <>
      <Flex justify='center' align='center'>
        <AuthModal />
        {user ? <Icons /> : <AuthButtons />}
        <UserMenu />
      </Flex>
    </>
  );
};
export default RightContent;
