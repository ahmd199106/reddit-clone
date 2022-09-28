import { Timestamp } from 'firebase/firestore';
import { atom } from 'recoil';

export interface Community {
  id: string;
  creator: string;
  numberOfMembers: number;
  privacyType: 'public' | 'resctricted' | 'private';
  createdAt?: Timestamp;
  imageURL?: string;
}
