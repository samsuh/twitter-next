import Image from 'next/image'
import SidebarMenuItems from './SidebarMenuItems'
import { HomeIcon, HashtagIcon } from '@heroicons/react/24/solid'
import {
  BookmarkIcon,
  ClipboardDocumentIcon,
  EllipsisHorizontalCircleIcon,
  EllipsisHorizontalIcon,
  BellIcon,
  InboxIcon,
  UserIcon,
} from '@heroicons/react/24/outline'

export default function Sidebar() {
  return (
    <div className='hidden sm:flex flex-col p-2 xl:items-start fixed h-full'>
      {/* Logo */}
      <div className='hoverEffect hover:bg-blue-100 p-2'>
        <Image src='/twitter-logo.png' width='50' height='50' />
      </div>
      {/* Menu */}
      <div className='mt-4 mb-2.5 xl:items-start'>
        <SidebarMenuItems text='Home' Icon={HomeIcon} active />
        <SidebarMenuItems text='Explore' Icon={HashtagIcon} />
        <SidebarMenuItems text='Notifications' Icon={BellIcon} />
        <SidebarMenuItems text='Messages' Icon={InboxIcon} />
        <SidebarMenuItems text='Bookmarks' Icon={BookmarkIcon} />
        <SidebarMenuItems text='Lists' Icon={ClipboardDocumentIcon} />
        <SidebarMenuItems text='Profile' Icon={UserIcon} />
        <SidebarMenuItems text='More' Icon={EllipsisHorizontalCircleIcon} />
      </div>
      {/* New Tweet Button */}
      <button className='bg-blue-400 text-white rounded-full w-56 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline'>
        Tweet
      </button>
      {/* Mini Profile */}
      <div className='hoverEffect text-gray-700 flex items-center justify-center xl:justify-start mt-auto'>
        <Image
          src='/user-default-img.png'
          width='100'
          height='100'
          className='h-10 w-10 rounded-full xl:mr-2'
        />
        <div className='leading-5 hidden xl:inline'>
          <h4 className='font-bold'>Name Here</h4>
          <p className='text-gray-500'>@username</p>
        </div>
        <EllipsisHorizontalIcon className='h-5 xl:ml-8 hidden xl:inline' />
      </div>
    </div>
  )
}
