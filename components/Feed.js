import { SparklesIcon } from '@heroicons/react/24/outline'
import Input from './Input'
import Post from './Post'

export default function Feed() {
  const posts = [
    {
      id: '1',
      name: 'Sam Suh',
      username: 'suhlidity',
      userImg: '/user-default-img.png',
      img: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2920&q=80',
      text: 'cool laptop',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      name: 'Sam Suh',
      username: 'suhlidity',
      userImg: '/user-default-img.png',
      img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2474&q=80',
      text: 'nice view',
      timestamp: '2 days ago',
    },
    {
      id: '3',
      name: 'Sam Suh',
      username: 'suhlidity',
      userImg: '/user-default-img.png',
      img: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2920&q=80',
      text: 'cool laptop',
      timestamp: '2 hours ago',
    },
    {
      id: '4',
      name: 'Sam Suh',
      username: 'suhlidity',
      userImg: '/user-default-img.png',
      img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2474&q=80',
      text: 'nice view',
      timestamp: '2 days ago',
    },
  ]

  return (
    <div className='xl:ml-[370px] border-l border-r xl:min-w-[576px] sm:ml-[73px] flex-grow max-w-xl border-gray-200'>
      <div className='flex py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200'>
        <h2 className='text-lg sm:text-xl font-bold cursor-pointer'>Home</h2>
        <div className='hover flex items-center justify-center p-0 ml-auto w-9 h-9'>
          <SparklesIcon className='h-5' />
        </div>
      </div>
      <Input />
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}
