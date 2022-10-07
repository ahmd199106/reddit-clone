import {
  Flex,
  Icon,
  Box,
  Text,
  Stack,
  Divider,
  Button,
  Link,
  Image,
  Spinner,
} from '@chakra-ui/react';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { Community, communityState } from '../../atoms/communitiesAtom';
import { auth, firestore, storage } from '../../firebase/clientApp';
import { RiCakeLine } from 'react-icons/ri';
import useSelectFile from '../../hooks/useSelectFile';
import { FaReddit } from 'react-icons/fa';
import { updateDoc, doc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { useSetRecoilState } from 'recoil';

type AboutProps = {
  communityData: Community;
};

const About: React.FC<AboutProps> = ({ communityData }) => {
  const [user] = useAuthState(auth); // will revisit how 'auth' state is passed
  const selectedFileRef = useRef<HTMLInputElement>(null);
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [changesSaved, setChangesSaved] = useState<boolean>();
  const setCommunityStateValue = useSetRecoilState(communityState);
  // const router = useRouter();
  // const { communityId } = router.query;

  const updateImage = async () => {
    if (!selectedFile) return;
    setUploadingImage(true);
    try {
      const imageRef = ref(storage, `communities/${communityData.id}/image`);
      await uploadString(imageRef, selectedFile, 'data_url');
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(firestore, 'communities', communityData.id), {
        imageURL: downloadURL,
      });
      console.log('HERE IS DOWNLOAD URL', downloadURL);

      // April 24 - added state update
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          ...prev.currentCommunity,
          imageURL: downloadURL,
        } as Community,
      }));
      setChangesSaved(true);
    } catch (error: any) {
      console.log('updateImage error', error.message);
    }
    // April 24 - removed reload
    // window.location.reload();

    setUploadingImage(false);
  };
  return (
    <Box pt='1px' position='sticky' top='14px'>
      <Flex
        justify='space-between'
        align='center'
        p={3}
        color='white'
        bg='blue.400'
        borderRadius='4px 4px 0px 0px'
      >
        <Text fontSize='10pt' fontWeight={700}>
          About Community
        </Text>
        <Icon as={HiOutlineDotsHorizontal} cursor='pointer' />
      </Flex>
      <Flex direction='column' p={3} bg='white' borderRadius='0px 0px 4px 4px'>
        <Stack>
          <Flex width='100%' p={2} fontWeight={600} fontSize='10pt'>
            <Flex direction='column' flexGrow={1}>
              <Text>{communityData?.numberOfMembers?.toLocaleString()}</Text>
              <Text>Members</Text>
            </Flex>
            <Flex direction='column' flexGrow={1}>
              <Text>1</Text>
              <Text>Online</Text>
            </Flex>
          </Flex>
          <Divider />
          <Flex
            align='center'
            width='100%'
            p={1}
            fontWeight={500}
            fontSize='10pt'
          >
            <Icon as={RiCakeLine} mr={2} fontSize={18} />
            {communityData?.createdAt && (
              <Text>
                Created{' '}
                {moment(
                  new Date(communityData.createdAt!.seconds * 1000),
                ).format('MMM DD, YYYY')}
              </Text>
            )}
          </Flex>
          <Link href={`/r/${communityData?.id}/submit`}>
            <Button mt={3} height='30px' width='100%'>
              Create Post
            </Button>
          </Link>
          {user?.uid === communityData?.creatorId && (
            <>
              <Divider />
              <Stack spacing={1} fontSize='10pt'>
                <Text fontWeight={600}>Admin</Text>
                <Flex align='center' justify='space-between'>
                  <Text
                    color='blue.500'
                    cursor='pointer'
                    _hover={{ textDecoration: 'underline' }}
                    onClick={() => {
                      setChangesSaved(false);
                      return selectedFileRef.current?.click();
                    }}
                  >
                    Change Image
                  </Text>
                  {communityData?.imageURL || selectedFile ? (
                    <Image
                      borderRadius='full'
                      boxSize='40px'
                      src={selectedFile || communityData?.imageURL}
                      alt='Community Image'
                    />
                  ) : (
                    <Icon
                      as={FaReddit}
                      fontSize={40}
                      color='brand.100'
                      mr={2}
                    />
                  )}{' '}
                </Flex>
                {selectedFile &&
                  (uploadingImage ? (
                    <Spinner />
                  ) : (
                    !changesSaved && (
                      <Text cursor='pointer' onClick={updateImage}>
                        Save Changes
                      </Text>
                    )
                  ))}
                <input
                  id='file-upload'
                  type='file'
                  accept='image/x-png,image/gif,image/jpeg'
                  hidden
                  ref={selectedFileRef}
                  onChange={onSelectFile}
                />
              </Stack>
            </>
          )}
        </Stack>
      </Flex>
    </Box>
  );
};
export default About;
