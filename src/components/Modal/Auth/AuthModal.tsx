import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Flex,
  Text,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { authModalState } from '../../../atoms/authModalAtom';
import AuthInputs from './AuthInputs';
import OAuthButtons from './OAuthButtons';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/clientApp';
import ResetPassword from './ResetPassword';

const AuthModal: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);
  const [user, loading, error] = useAuthState(auth);

  const handleClose = () => {
    setModalState((prev) => ({
      ...prev,
      open: false,
    }));
  };
  // console.log(user, 'user');
  useEffect(() => {
    if (user) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <Modal isOpen={modalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign='center'>
            {modalState.view === 'login' && 'Log In'}
            {modalState.view === 'signup' && 'Sign Up'}
            {modalState.view === 'resetPassword' && 'reset Password'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display='flex'
            flexDirection='column'
            justifyContent='center'
            alignItems='center'
          >
            <Flex
              direction='column'
              justify='center'
              align='center'
              width='75%'
              py={3}
            >
              {modalState.view === 'login' || modalState.view === 'signup' ? (
                <>
                  <OAuthButtons />
                  <Text color='gray.500' fontWeight={700} mb={4}>
                    OR
                  </Text>
                  <AuthInputs />
                </>
              ) : (
                <ResetPassword />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default AuthModal;
