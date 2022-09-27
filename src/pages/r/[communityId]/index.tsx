import { doc, getDoc } from 'firebase/firestore';
import { GetServerSidePropsContext } from 'next';
import React from 'react';
import { Community } from '../../../atoms/communitiesAtom';
import { firestore } from '../../../firebase/clientApp';
import safeJsonStringify from 'safe-json-stringify';
import NotFound from '../../../components/Community/NotFound';
import Header from '../../../components/Community/Header';
import PageContentLayout from '../../../components/Layout/PageContent';
import { Flex, Text } from '@chakra-ui/react';

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  console.log('communityData', communityData);

  // Community was not found in the database
  if (!communityData) {
    return <NotFound />;
  }

  return (
    <>
      <Header communityData={communityData} />
      <PageContentLayout>
        {/* Left Content */}
        <>
          <Flex>
            <Text>hi left content</Text>
          </Flex>
          {/* <CreatePostLink /> */}
          {/* <Posts
        communityData={communityData}
        userId={user?.uid}
        loadingUser={loadingUser}
      /> */}
        </>
        {/* Right Content */}
        <>
          {/* <About communityData={communityData} /> */}
          <Flex>
            <Text>hi right content</Text>
          </Flex>
        </>
      </PageContentLayout>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const communityDocRef = doc(
      firestore,
      'communities',
      context.query.communityId as string,
    );
    const communityDoc = await getDoc(communityDocRef);

    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({
                id: communityDoc.id,
                ...communityDoc.data(),
              }), // needed for dates
            )
          : '',
      },
    };
  } catch (error) {
    // Could create error page here
    console.log('getServerSideProps error - [communityId]', error);
  }
}

export default CommunityPage;
