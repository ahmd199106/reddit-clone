import { Alert, AlertIcon, Flex, Icon, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { BiPoll } from 'react-icons/bi';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import { firestore, storage } from '../../firebase/clientApp';
import ImageUpload from './PostsForm/ImageUpload';
import TextInputs from './PostsForm/TextInputs';
import TabItem from './TabItem';

type NewPostFormProps = {
  user: User;
};

const formTabs: TabItem[] = [
  {
    title: 'Post',
    icon: IoDocumentText,
  },
  {
    title: 'Images & Video',
    icon: IoImageOutline,
  },
  {
    title: 'Link',
    icon: BsLink45Deg,
  },
  {
    title: 'Poll',
    icon: BiPoll,
  },
  {
    title: 'Talk',
    icon: BsMic,
  },
];

export type TabItem = {
  title: string;
  icon: typeof Icon.arguments;
};

const NewPostForm: React.FC<NewPostFormProps> = ({ user }) => {
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: '',
    body: '',
  });
  const [selectedFile, setSelectedFile] = useState<string>();
  const selectFileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleCreatePost = async () => {
    const { communityId } = router.query;
    setLoading(true);
    const { title, body } = textInputs;
    try {
      const postDocRef = await addDoc(collection(firestore, 'posts'), {
        communityId: communityId as string,
        creatorId: user.uid,
        creatorDisplayName: user.email!.split('@')[0],
        title,
        body,
        numberOfComments: 0,
        voteStatus: 0,
        createdAt: serverTimestamp(),
      });

      console.log('HERE IS NEW POST ID', postDocRef.id);

      // // check if selectedFile exists, if it does, do image processing
      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, 'data_url');
        const downloadURL = await getDownloadURL(imageRef);

        //update post doc by adding imageURL
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
        console.log('HERE IS DOWNLOAD URL', downloadURL);
      }

      router.back();
    } catch (error) {
      console.log('createPost error', error);
      setError(true);
    }
    setLoading(false);
  };

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target?.result as string);
      }
    };
  };

  const onTextChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Flex direction='column' bg='white' borderRadius={4} mt={2}>
      <Flex width='100%'>
        {formTabs.map((item, index) => (
          <TabItem
            key={index}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === 'Post' && (
          <TextInputs
            textInputs={textInputs}
            onChange={onTextChange}
            handleCreatePost={handleCreatePost}
            loading={loading}
          />
        )}
        {selectedTab === 'Images & Video' && (
          <ImageUpload
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
            selectFileRef={selectFileRef}
            onSelectImage={onSelectImage}
          />
        )}
      </Flex>
      {error && (
        <Alert status='error'>
          <AlertIcon />
          <Text>Error Creating post</Text>
        </Alert>
      )}
    </Flex>
  );
};

export default NewPostForm;
