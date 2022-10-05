import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';
import { communityState } from '../../../atoms/communitiesAtom';
import PageContent from '../../../components/Layout/PageContent';
import NewPostForm from '../../../components/Posts/NewPostForm';
import { auth } from '../../../firebase/clientApp';

const SubmitPostPage: React.FC = () => {
  const [user] = useAuthState(auth);
const communityStateValue = useRecoilValue(communityState);
console.log(communityStateValue, 'COMMUNITY');


  return (
    <PageContent>
      {user && <NewPostForm user={user} />}
      <Box p='14px 0px' borderBottom='1px solid' borderColor='white'>
        <Text fontWeight={600}>Create a post</Text>
      </Box>
    </PageContent>
  );
};
export default SubmitPostPage;
