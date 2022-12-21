import { Flex, Box } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import React, { useState } from 'react';
import { Post } from '../../../atoms/postsAtom';
import CommentInput from './CommentInput';

type CommentsProps = {
  user?: User | null;
  selectedPost: Post;
  communityId: string;
};

const Comments: React.FC<CommentsProps> = ({
  user,
  selectedPost,
  communityId,
}) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentFetchLoading, setCommentFetchLoading] = useState(false);
  const [commentCreateLoading, setCommentCreateLoading] = useState(false);

  return (
    <Box bg='white' p={2} borderRadius='0px 0px 4px 4px'>
      <Flex
        direction='column'
        pl={10}
        pr={4}
        mb={6}
        fontSize='10pt'
        width='100%'
      >
        <CommentInput
          comment={comment}
          setComment={setComment}
          loading={commentCreateLoading}
          user={user}
          onCreateComment={onCreateComment}
        />
      </Flex>
    </Box>
  );
};

export default Comments;
