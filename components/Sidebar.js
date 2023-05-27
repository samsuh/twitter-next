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
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { useEffect } from 'react'
import { db } from '../firebase'
import { useRecoilState } from 'recoil'
import { userState } from '../atom/userAtom'
import { doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/router'

export default function Sidebar() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useRecoilState(userState)
  const auth = getAuth()
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchUser = async () => {
          const docRef = doc(db, 'users', auth.currentUser.providerData[0].uid)
          const docSnap = await getDoc(docRef)
          if (docSnap.exists()) {
            setCurrentUser(docSnap.data())
          }
        }
        fetchUser()
      }
    })
  }, [])
  const onSignout = () => {
    signOut(auth)
    setCurrentUser(null)
  }

  return (
    <div className='hidden sm:flex flex-col p-2 xl:items-start fixed h-full xl:ml-24'>
      {/* Logo */}
      <div className='hoverEffect hover:bg-blue-100 px-1'>
        <Image src='/twitter-logo.png' alt='logo' width='50' height='50' />
      </div>
      {/* Menu */}
      <div className='mt-4 mb-2.5 xl:items-start'>
        <SidebarMenuItems text='Home' Icon={HomeIcon} active />
        <SidebarMenuItems text='Explore' Icon={HashtagIcon} />
        {currentUser && (
          <>
            <SidebarMenuItems text='Notifications' Icon={BellIcon} />
            <SidebarMenuItems text='Messages' Icon={InboxIcon} />
            <SidebarMenuItems text='Bookmarks' Icon={BookmarkIcon} />
            <SidebarMenuItems text='Lists' Icon={ClipboardDocumentIcon} />
            <SidebarMenuItems text='Profile' Icon={UserIcon} />
            <SidebarMenuItems text='More' Icon={EllipsisHorizontalCircleIcon} />
          </>
        )}
      </div>
      {/* New Tweet Button */}
      {currentUser ? (
        <>
          <button className='bg-blue-400 text-white rounded-full w-56 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline'>
            Tweet
          </button>
          {/* Mini Profile */}
          <div className='hoverEffect text-gray-700 flex items-center justify-center xl:justify-start mt-auto'>
            <Image
              src={currentUser.userImg}
              width='100'
              height='100'
              className='h-10 w-10 rounded-full xl:mr-2'
              alt='user image'
              //temporary signout button
              onClick={onSignout}
            />
            <div className='leading-5 hidden xl:inline'>
              <h4 className='font-bold'>{currentUser?.name}</h4>
              <p className='text-gray-500'>@{currentUser?.username}</p>
            </div>
            <EllipsisHorizontalIcon className='h-5 xl:ml-8 hidden xl:inline' />
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => router.push('auth/SignIn')}
            className='bg-blue-400 text-white rounded-full w-36 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline'
          >
            Sign In
          </button>
        </>
      )}
    </div>
  )
}
