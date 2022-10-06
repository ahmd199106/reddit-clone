import {
  getDocs,
  collection,
  doc,
  increment,
  writeBatch,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { authModalState } from '../atoms/authModalAtom';
import {
  Community,
  CommunitySnippet,
  communityState,
} from '../atoms/communitiesAtom';
import { auth, firestore } from '../firebase/clientApp';
 
const useCommunityData = () => {
  const [user] = useAuthState(auth);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onJoinLeaveCommunity = (
    communityData: Community,
    isJoined?: boolean,
  ) => {
    console.log('ON JOIN LEAVE', communityData.id);

    if (!user) {
      setAuthModalState({ open: true, view: 'login' });
      return;
    }

    setLoading(true);
    if (isJoined) {
      leaveCommunity(communityData.id);
      return;
    }
    joinCommunity(communityData);
  };

  const getMySnippets = async () => {
    setLoading(true);
    try {
      // get user mySnippets
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`),
      );
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
      }));
      console.log('here are the userss snippets', snippets);
    } catch (error: any) {
      console.log('Error getting user snippets', error);
      setError(error.message);
    }
    setLoading(false);
  };

  const joinCommunity = async (communityData: Community) => {
    console.log('JOINING COMMUNITY: ', communityData.id);
    try {
      //batch write
      const batch = writeBatch(firestore);

      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || '',
      };
      // adding the community snippet to that particular user
      batch.set(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id, // will for sure have this value at this point
        ),
        newSnippet,
      );
      // incremenet the number by 1
      batch.update(doc(firestore, 'communities', communityData.id), {
        numberOfMembers: increment(1),
      });

      // perform batch writes
      await batch.commit();

      // Add current community to communityState.mySnippets to update the recoil state
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (error: any) {
      console.log('joinCommunity error', error);
      setError(error.message);
    }
    setLoading(false);
  };

  const leaveCommunity = async (communityId: string) => {
    try {
      //batch write
      const batch = writeBatch(firestore);
      // deleeting the community snippet to that particular user
      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets/${communityId}`),
      );

      // decrement the number by 1
      batch.update(doc(firestore, 'communities', communityId), {
        numberOfMembers: increment(-1),
      });

      await batch.commit();

      // delete current community to communityState.mySnippets to update the recoil state
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.communityId !== communityId,
        ),
      }));
    } catch (error: any) {
      console.log('leaveCommunity error', error);
      setError(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    getMySnippets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return {
    communityStateValue,
    onJoinLeaveCommunity,
    loading,
  };
};
export default useCommunityData;
