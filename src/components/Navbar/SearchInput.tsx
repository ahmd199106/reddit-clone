/* eslint-disable react/no-children-prop */
import { SearchIcon } from '@chakra-ui/icons';
import { Flex, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React from 'react';

type SearchInputProps = {
  user?: User | null;
};

const SearchInput: React.FC<SearchInputProps> = ({ user }) => {
  return (
    <Flex flexGrow={1} align='center' mr={1} maxWidth={user ? 'auto' : '600px'}>
      <InputGroup>
        <InputLeftElement
          pointerEvents='none'
          children={<SearchIcon color='gray.400' mb={1} />}
        />
        <Input
          placeholder='Search Reddit'
          fontSize='10pt'
          _placeholder={{ color: 'gray.500' }}
          _hover={{ border: '1px solid', borderColor: 'blue.500', bg: 'white' }}
          _focus={{
            outline: 'none',
            border: '1px solid',
            borderColor: 'blue.500',
          }}
          height='34px'
          bg='gray.200'
        />
      </InputGroup>
    </Flex>
  );
};
export default SearchInput;
