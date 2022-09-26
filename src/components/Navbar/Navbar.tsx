import React from 'react';
import { Flex, Image, Text } from '@chakra-ui/react';
import SearchInput from './SearchInput';
import RightContent from '../Navbar/RightContent/RightContent';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/clientApp';
import Directory from './Directory/Directory';

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = () => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <Flex
      bg='white'
      height='44px'
      padding='6px 12px'
      justify={{ md: 'space-between' }}
    >
      <Flex
        align='center'
        width={{ base: '40px', md: 'auto' }}
        mr={{ base: 0, md: 2 }}
      >
        <Image alt='logo' src='/images/redditFace.svg' height='30px' />
        <Image
          alt='logo'
          src='/images/redditText.svg'
          height='40px'
          display={{ base: 'none', md: 'unset' }}
        />
      </Flex>
      {user && <Directory />}
      <SearchInput user={user} />
      <RightContent user={user} />
    </Flex>
  );
};

export default Navbar;
