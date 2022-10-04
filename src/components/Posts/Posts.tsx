import { query, collection, where, orderBy, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Community } from '../../atoms/communitiesAtom';
import { auth, firestore } from '../../firebase/clientApp';
import { Flex, Stack, Text } from '@chakra-ui/react';
import usePosts from '../../hooks/usePosts';
import { Post } from '../../atoms/postsAtom';
import PostItem from './PostItem';
import { useAuthState } from 'react-firebase-hooks/auth';

type PostsProps = {
  communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onSelectPost,
    onDeletePost,
  } = usePosts();

  const getPosts = async () => {
    try {
      // get posts for this community
      const postsQuery = query(
        collection(firestore, 'posts'),
        where('communityId', '==', communityData.id),
        orderBy('createdAt', 'desc'),
      );

      const postsDocs = await getDocs(postsQuery);
      const posts = postsDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      //store the queried posts in post state from recoil API(useRecoilState)
      setPostStateValue((prev) => ({ ...prev, posts: posts as Post[] }));

      console.log(posts, 'posts');
    } catch (error: any) {
      console.log('error loding posts', error.message);
    }
  };
  useEffect(() => {
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack>
      {postStateValue.posts.map((item) => (
        <PostItem
          key={item.id}
          post={item}
          userIsCreator={user?.uid === item.creatorId}
          userVoteValue={undefined}
          onVote={onVote}
          onSelectPost={onSelectPost}
          onDeletePost={onDeletePost}
        />
      ))}
    </Stack>
  );
};
export default Posts;
