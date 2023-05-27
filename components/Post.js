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

export default function Post({ post, id }) {
  const [open, setOpen] = useRecoilState(modalState)
  const [currentUser, setCurrentUser] = useRecoilState(userState)
  const [postId, setPostId] = useRecoilState(postIdState)
  const [likes, setLikes] = useState([])
  const [hasLiked, setHasLiked] = useState(false)
  const [commentCount, setCommentCount] = useState([])
  const router = useRouter()

  //get likes info from firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'posts', id, 'likes'),
      (snapshot) => setLikes(snapshot.docs)
    )
  }, [db, post])

  //check if currently logged in user has already liked this post
  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === currentUser?.uid) !== -1)
  }, [likes, currentUser])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'posts', id, 'comments'),
      (snapshot) => setCommentCount(snapshot.docs)
    )
  }, [db, post])

  const likePost = async () => {
    if (currentUser) {
      if (hasLiked) {
        await deleteDoc(doc(db, 'posts', id, 'likes', currentUser?.uid))
      } else {
        await setDoc(doc(db, 'posts', id, 'likes', currentUser?.uid), {
          username: currentUser?.username,
        })
      }
    } else {
      router.push('/auth/SignIn')
    }
  }

  const deletePost = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      //delete post
      deleteDoc(doc(db, 'posts', id))
      //clean up image from deleted post
      if (post.data().image) {
        deleteObject(ref(storage, `posts/${id}/image`))
      }
      router.push('/')
    }
  }

  return (
    <div className='flex p-3 cursor-pointer border-b border-gray-200'>
      <Image
        src={post?.data()?.userImg} //userImg from the post in db
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
              {post?.data()?.name}
            </h4>
            <span className='text-sm sm:text-[15px]'>
              @{post?.data()?.username} -{' '}
            </span>
            <span className='text-sm sm:text-[15px] hover:underline'>
              <Moment fromNow>{post?.data()?.timestamp?.toDate()}</Moment>
            </span>
          </div>
          <EllipsisHorizontalIcon className='h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2' />
        </div>
        <p className='text-gray-800 text-[15px] sm:text-[16px] mb-2'>
          {post?.data()?.text}
        </p>
        {post?.data()?.image && (
          <Image
            src={post?.data()?.image}
            alt='post image'
            width='500'
            height='350'
            className='rounded-2xl mr-2'
          />
        )}
        <div className='flex justify-between text-gray-500 p-2'>
          <div className='flex items-center'>
            <ChatBubbleLeftIcon
              className='h-9 w-10 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100'
              onClick={() => {
                if (!currentUser) {
                  router.push('/auth/SignIn')
                } else {
                  setOpen(!open)
                  setPostId(id)
                }
              }}
            />
            {commentCount?.length > 0 && (
              <span className='text-gray-600 text-sm select-none'>
                {commentCount?.length}
              </span>
            )}
          </div>
          {currentUser?.uid === post?.data()?.id && (
            <TrashIcon
              className='h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100'
              onClick={deletePost}
            />
          )}
          <div className='flex items-center'>
            {hasLiked ? (
              <HeartIconSolid
                className='h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100'
                onClick={likePost}
              />
            ) : (
              <HeartIcon
                className='h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100'
                onClick={likePost}
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
