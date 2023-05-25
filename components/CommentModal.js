import { useRecoilState } from 'recoil'
import { modalState, postIdState } from '../atom/modalAtom'
import Modal from 'react-modal'
import {
  FaceSmileIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import Image from 'next/image'
import Moment from 'react-moment'
import { userState } from '../atom/userAtom'
import { useRouter } from 'next/router'

export default function CommentModal() {
  const [open, setOpen] = useRecoilState(modalState)
  const [postId] = useRecoilState(postIdState)
  const [post, setPost] = useState({})
  const [currentUser] = useRecoilState(userState)
  const [input, setInput] = useState('')
  const router = useRouter()

  useEffect(() => {
    onSnapshot(doc(db, 'posts', postId), (snapshot) => {
      setPost(snapshot)
    })
  }, [postId, db])

  const sendComment = async () => {
    await addDoc(collection(db, 'posts', postId, 'comments'), {
      comment: input,
      name: currentUser.name,
      username: currentUser.username,
      userImg: currentUser.userImg,
      timestamp: serverTimestamp(),
    })
    setOpen(false)
    setInput('')
    router.push(`/posts/${postId}`)
  }

  return (
    <div>
      {open && (
        <Modal
          isOpen={open}
          onRequestClose={() => setOpen(false)}
          className='max-w-lg w-[90%] absolute top-24 left-[50%] translate-x-[-50%] bg-white border-2 border-gray-200 rounded-xl shadow-md'
        >
          <div className='p-1'>
            <div className='border-b border-gray-200 py-2 px-1.5'>
              <div
                className='hoverEffect w-11 h-11 flex items-center justify-center'
                onClick={() => {
                  setOpen(false)
                }}
              >
                <XMarkIcon className='h-[22px] text-gray-700' />
              </div>
            </div>
            <div className='flex p-2 items-center space-x-1 relative'>
              <span className='absolute w-0.5 h-full z-[-1] bg-gray-300 left-8 top-11' />
              <Image
                src={post?.data()?.userImg}
                alt='user profile image'
                width='100'
                height='100'
                className='w-11 h-11 rounded-full mr-4'
              />
              <h4 className='font-bold text-[15px] sm:text-[16px] hover:underline'>
                {post?.data()?.name}
              </h4>
              <span className='text-sm sm:text-[15px]'>
                @{post?.data()?.username} -{' '}
              </span>
              <span className='text-sm sm:text-[15px] hover:underline'>
                <Moment fromNow>{post?.data()?.timestamp.toDate()}</Moment>
              </span>
            </div>
            <p className='text-gray-500 text-[15px] sm:text-[16px] ml-16 mb-2'>
              {post?.data()?.text}
            </p>
            {/* comment input */}
            <div className='flex p-3 space-x-3'>
              <Image
                src={
                  currentUser ? currentUser.userImg : '/user-default-img.png'
                }
                alt='user-image'
                width='100'
                height='100'
                className='h-12 w-12 rounded-full cursor-pointer hover:brightness-95'
              />
              <div className='w-full divide-y divide-gray-200'>
                <div>
                  <textarea
                    className='w-full border-none focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700'
                    rows='2'
                    placeholder='Tweet your Reply'
                    onChange={(e) => {
                      setInput(e.target.value)
                    }}
                    value={input}
                  ></textarea>
                </div>
                <div className='flex items-center justify-between pt-2.5'>
                  <div className='flex'>
                    <div>
                      <PhotoIcon className='h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100' />
                      {/* <input
                        type='file'
                        hidden
                        ref={filePickerRef}
                        onChange={addImageToPost}
                      /> */}
                    </div>
                    <FaceSmileIcon className='h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100' />
                  </div>
                  <button
                    disabled={!input.trim()}
                    onClick={sendComment}
                    className='bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50'
                  >
                    Tweet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
