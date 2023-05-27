import {
  FaceSmileIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useRecoilState } from 'recoil'
import { userState } from '../atom/userAtom'
import { getAuth, signOut } from 'firebase/auth'
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db, storage } from '../firebase'
import { useRef, useState } from 'react'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'

export default function Input() {
  //use FirebaseAuthentication "currentUser" instead of NextAuth "session.user"
  const [currentUser, setCurrentUser] = useRecoilState(userState)
  const [input, setInput] = useState('')
  const filePickerRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const auth = getAuth()
  const onSignout = () => {
    signOut(auth)
    setCurrentUser(null)
  }

  const sendPost = async () => {
    if (loading) return
    setLoading(true)
    const docRef = await addDoc(collection(db, 'posts'), {
      id: currentUser.uid,
      text: input,
      userImg: currentUser.userImg,
      timestamp: serverTimestamp(),
      name: currentUser.name,
      username: currentUser.username,
    })

    const imageRef = ref(storage, `posts/${docRef.id}/image`)
    if (selectedFile) {
      await uploadString(imageRef, selectedFile, 'data_url').then(async () => {
        const downloadURL = await getDownloadURL(imageRef)
        await updateDoc(doc(db, 'posts', docRef.id), {
          image: downloadURL,
        })
      })
    }

    setInput('')
    setSelectedFile(null)
    setLoading(false)
  }

  const addImageToPost = (e) => {
    const reader = new FileReader()
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0])
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result)
    }
  }

  return (
    <>
      {currentUser && (
        <div className='flex border-b border-gray-200 p-3 space-x-3'>
          <Image
            src={currentUser ? currentUser.userImg : '/user-default-img.png'}
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
                placeholder="What's happening?"
                onChange={(e) => {
                  setInput(e.target.value)
                }}
                value={input}
              ></textarea>
            </div>
            {selectedFile && (
              <div className='relative'>
                <XMarkIcon
                  className='h-7 text-black absolute cursor-pointer bg-white rounded-full m-2'
                  onClick={() => setSelectedFile(null)}
                />
                <Image
                  src={selectedFile}
                  alt='selected image'
                  className={`${loading && 'animate-pulse'}`}
                />
              </div>
            )}
            <div className='flex items-center justify-between pt-2.5'>
              {!loading && (
                <>
                  <div className='flex'>
                    {/* Add Photo To Post */}
                    <div onClick={() => filePickerRef.current.click()}>
                      <PhotoIcon className='h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100' />
                      <input
                        type='file'
                        hidden
                        ref={filePickerRef}
                        onChange={addImageToPost}
                      />
                    </div>
                    <FaceSmileIcon className='h-10 w-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100' />
                  </div>
                  <button
                    disabled={!input.trim()}
                    onClick={sendPost}
                    className='bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50'
                  >
                    Tweet
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
