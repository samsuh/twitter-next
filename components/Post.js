import {
  ChartBarIcon,
  ChatBubbleLeftIcon,
  EllipsisHorizontalIcon,
  HeartIcon,
  ShareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useRecoilState } from 'recoil'
import { modalState } from '../atom/modalAtom'
import { userState } from '../atom/userAtom'
import Moment from 'react-moment'

export default function Post({ post }) {
  console.log('post from Post Component', post)
  // console.log('post.data()', post.data())
  // const { id, name, username, userImg, img, text, timestamp } = post

  const [open, setOpen] = useRecoilState(modalState)
  const [currentUser, setCurrentUser] = useRecoilState(userState)

  return (
    <div className='flex p-3 cursor-pointer border-b border-gray-200'>
      <Image
        src={currentUser ? currentUser.userImg : '/user-default-img.png'}
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
              {post.data().name}
            </h4>
            <span className='text-sm sm:text-[15px]'>
              @{post.data().username} -{' '}
            </span>
            <span className='text-sm sm:text-[15px] hover:underline'>
              <Moment fromNow>{post?.data().timestamp?.toDate()}</Moment>
            </span>
          </div>
          <EllipsisHorizontalIcon className='h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2' />
        </div>
        <p className='text-gray-800 text-[15px] sm:text-[16px] mb-2'>
          {post.data().text}
        </p>
        <Image
          src={post.data().image}
          width='500'
          height='350'
          className='rounded-2xl mr-2'
        />
        <div className='flex justify-between text-gray-500 p-2'>
          <ChatBubbleLeftIcon
            className='h-9 w-10 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100'
            onClick={() => setOpen(!open)}
          />
          <TrashIcon className='h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100' />
          <HeartIcon className='h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100' />
          <ShareIcon className='h-9 w-10 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100' />
          <ChartBarIcon className='h-9 w-10 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100' />
        </div>
      </div>
    </div>
  )
}
