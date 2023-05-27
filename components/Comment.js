import {
  ChartBarIcon,
  ChatBubbleLeftIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  ShareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import Image from 'next/image'
import { useRecoilState } from 'recoil'
import { modalState, postIdState } from '../atom/modalAtom'
import { userState } from '../atom/userAtom'
import Moment from 'react-moment'
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore'
import { db, storage } from '../firebase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { deleteObject, ref } from 'firebase/storage'

export default function Comment({ originalPostId, comment, commentId }) {
  const [open, setOpen] = useRecoilState(modalState)
  const [currentUser, setCurrentUser] = useRecoilState(userState)
  const [postId, setPostId] = useRecoilState(postIdState)
  const [likes, setLikes] = useState([])
  const [hasLiked, setHasLiked] = useState(false)
  const router = useRouter()

  //get likes info from firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'posts', originalPostId, 'comments', commentId, 'likes'),
      (snapshot) => setLikes(snapshot.docs)
    )
    console.log('originalPostId:', originalPostId)
    // console.log('commentId:', commentId)
    console.log('db:', db)
  }, [db, originalPostId, commentId])

  //check if currently logged in user has already liked this post
  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === currentUser?.uid) !== -1)
  }, [likes, currentUser])

  const likeComment = async () => {
    if (currentUser) {
      if (hasLiked) {
        await deleteDoc(
          doc(
            db,
            'posts',
            originalPostId,
            'comments',
            commentId,
            'likes',
            currentUser?.uid
          )
        )
      } else {
        await setDoc(
          doc(
            db,
            'posts',
            originalPostId,
            'comments',
            commentId,
            'likes',
            currentUser?.uid
          ),
          {
            username: currentUser?.username,
          }
        )
      }
    } else {
      router.push('/auth/SignIn')
    }
  }

  const deleteComment = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      //delete comemnt
      deleteDoc(doc(db, 'posts', originalPostId, 'comments', commentId))
    }
  }

  return (
    <div className='flex p-3 cursor-pointer border-b border-gray-200'>
      <Image
        // src={currentUser ? currentUser?.userImg : '/user-default-img.png'} currently logged in user
        src={comment?.userImg} //userImg from the comment in db
        alt='user profile image'
        width='100'
        height='100'
        className='w-11 h-11 rounded-full mr-4'
      />
      {/* right side */}
      <div className='flex-1'>
        {/* header */}
        <div className='flex items-center justify-between'>
          <div className='flex space-x-1 whitespace-nowrap items-center'>
            <h4 className='font-bold text-[15px] sm:text-[16px] hover:underline'>
              {comment?.name}
            </h4>
            <span className='text-sm sm:text-[15px]'>
              @{comment?.username} -{' '}
            </span>
            <span className='text-sm sm:text-[15px] hover:underline'>
              <Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
            </span>
          </div>
          <EllipsisHorizontalIcon className='h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2' />
        </div>
        <p className='text-gray-800 text-[15px] sm:text-[16px] mb-2'>
          {comment?.comment}
        </p>
        <div className='flex justify-between text-gray-500 p-2'>
          <div className='flex items-center'>
            <ChatBubbleLeftIcon
              className='h-9 w-10 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100'
              onClick={() => {
                if (!currentUser) {
                  router.push('/auth/SignIn')
                } else {
                  setOpen(!open)
                  setPostId(originalPostId)
                }
              }}
            />
          </div>
          {currentUser?.id === comment?.uid && (
            <TrashIcon
              className='h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100'
              onClick={deleteComment}
            />
          )}
          <div className='flex items-center'>
            {hasLiked ? (
              <HeartIconSolid
                className='h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100'
                onClick={likeComment}
              />
            ) : (
              <HeartIcon
                className='h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100'
                onClick={likeComment}
              />
            )}
            {likes.length > 0 && (
              <span
                className={`${hasLiked && 'text-red-600'} text-sm select-none`}
              >
                {likes.length}
              </span>
            )}
          </div>
          <ShareIcon className='h-9 w-10 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100' />
          <ChartBarIcon className='h-9 w-10 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100' />
        </div>
      </div>
    </div>
  )
}
