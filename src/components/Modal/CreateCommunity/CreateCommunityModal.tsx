import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { BsFillPersonFill, BsFillEyeFill } from 'react-icons/bs';
import { HiLockClosed } from 'react-icons/hi';
import { auth, firestore } from '../../../firebase/clientApp';

type CreateCommunityModalProps = {
  isOpen: boolean;
  handleClose: () => void;
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  isOpen,
  handleClose,
}) => {
  const [communityName, setCommunityName] = useState('');
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [communityType, setCommunityType] = useState('public');
  const [nameError, setNameError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);

  const handleCreateCommunity = async () => {
    if (nameError) setNameError('');
    //validate the community
    const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;

    if (format.test(communityName) || communityName.length < 3) {
      return setNameError(
        'Community names must be between 3–21 characters, and can only contain letters, numbers, or underscores.',
      );
    }

    setLoading(true);
    //create the community doc in firestore
    //check if the name is not taken
    try {
      const communityDocRef = doc(firestore, 'communities', communityName);
      const communityDoc = await getDoc(communityDocRef);
      if (communityDoc.exists()) {
        throw new Error(`Sorry, /r${communityName} is taken. Try another.`);
      }

      await setDoc(communityDocRef, {
        creatorId: user?.uid,
        createdAt: serverTimestamp(),
        numberOfMembers: 1,
        privacyType: 'public',
      });
    } catch (error: any) {
      console.log('handleCreateCommunity Error', error);
      setNameError(error.message);
    }

    setLoading(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 21) return;
    setCommunityName(event.target.value);
    setCharsRemaining(21 - event.target.value.length);
  };

  const onCommunityTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const {
      target: { name },
    } = event;
    if (name === communityType) return;
    setCommunityType(name);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size='lg'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display='flex'
            flexDirection='column'
            fontSize={15}
            padding={3}
          >
            Create a community
          </ModalHeader>
          <ModalCloseButton />
          <Box pr={3} pl={3}>
            <Divider />
            <ModalCloseButton />
            <ModalBody display='flex' flexDirection='column' padding='10px 0px'>
              <Text fontWeight={600} fontSize={15}>
                Name
              </Text>
              <Text fontSize={11} color='gray.500'>
                Community names including capitalization cannot be changed
              </Text>
              <Text
                color='gray.400'
                position='relative'
                top='28px'
                left='10px'
                width='20px'
              >
                r/
              </Text>
              <Input
                position='relative'
                name='name'
                value={communityName}
                onChange={handleChange}
                pl='22px'
                type={''}
                size='sm'
              />
              <Text
                fontSize='9pt'
                color={charsRemaining === 0 ? 'red' : 'gray.500'}
                pt={2}
              >
                {charsRemaining} Characters remaining
              </Text>
              <Text fontSize='9pt' color='red' pt={1}>
                {nameError}
              </Text>
              <Box mt={4} mb={4}>
                <Text fontWeight={600} fontSize={15}>
                  Community Type
                </Text>
                <Stack spacing={2} pt={1}>
                  <Checkbox
                    colorScheme='blue'
                    name='public'
                    isChecked={communityType === 'public'}
                    onChange={onCommunityTypeChange}
                  >
                    <Flex alignItems='center'>
                      <Icon as={BsFillPersonFill} mr={2} color='gray.500' />
                      <Text fontSize='10pt' mr={1}>
                        Public
                      </Text>
                      <Text fontSize='8pt' color='gray.500' pt={1}>
                        Anyone can view, post, and comment to this community
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    colorScheme='blue'
                    name='restricted'
                    isChecked={communityType === 'restricted'}
                    onChange={onCommunityTypeChange}
                  >
                    <Flex alignItems='center'>
                      <Icon as={BsFillEyeFill} color='gray.500' mr={2} />
                      <Text fontSize='10pt' mr={1}>
                        Restricted
                      </Text>
                      <Text fontSize='8pt' color='gray.500' pt={1}>
                        Anyone can view this community, but only approved users
                        can post
                      </Text>
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    colorScheme='blue'
                    name='private'
                    isChecked={communityType === 'private'}
                    onChange={onCommunityTypeChange}
                  >
                    <Flex alignItems='center'>
                      <Icon as={HiLockClosed} color='gray.500' mr={2} />
                      <Text fontSize='10pt' mr={1}>
                        Private
                      </Text>
                      <Text fontSize='8pt' color='gray.500' pt={1}>
                        Only approved users can view and submit to this
                        community
                      </Text>
                    </Flex>
                  </Checkbox>
                </Stack>
              </Box>
            </ModalBody>
          </Box>{' '}
          <ModalFooter bg='gray.100' borderRadius='0px 0px 10px 10px'>
            <Button
              variant='outline'
              height='30px'
              mr={2}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              variant='solid'
              height='30px'
              onClick={handleCreateCommunity}
              isLoading={loading}
            >
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateCommunityModal;
