import React, { useState } from 'react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { TiHome } from 'react-icons/ti';
import { CgProfile } from 'react-icons/cg';
import { GrAdd } from 'react-icons/gr';
import { MdOutlineLogin } from 'react-icons/md';
import CreateCommunityModal from '../../Modal/CreateCommunity/CreateCommunityModal';

const Directory: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <Menu>
      <MenuButton
        cursor='pointer'
        padding='0px 6px'
        borderRadius='4px'
        _hover={{ outline: '1px solid', outlineColor: 'gray.200' }}
      >
        <Flex
          align='center'
          justify='space-between'
          width={{ base: 'auto', lg: '100px' }}
        >
          <Flex align='center'>
            <Icon fontSize={24} as={TiHome} mr={{ base: 1, md: 2 }} />
            <Flex display={{ base: 'none', lg: 'flex' }}>
              <Text fontWeight={600} fontSize='10pt'>
                Home
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon color='gray.500' />
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuItem>
          <CreateCommunityModal
            isOpen={isModalOpen}
            handleClose={handleClose}
          />
        </MenuItem>
        <MenuItem
          fontSize='10pt'
          fontWeight={700}
          _hover={{ bg: 'blue.500', color: 'white' }}
        >
          <Flex
            align='center'
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            <Icon fontSize={20} mr={2} as={GrAdd} />
            Create Community
          </Flex>
        </MenuItem>
        <MenuDivider />
        <MenuItem
          fontSize='10pt'
          fontWeight={700}
          _hover={{ bg: 'blue.500', color: 'white' }}
        >
          <Flex align='center'>
            <Icon fontSize={20} mr={2} as={MdOutlineLogin} />
            Log Out
          </Flex>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
export default Directory;
