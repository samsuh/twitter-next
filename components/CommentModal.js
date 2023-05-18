import { useRecoilState } from 'recoil'
import { modalState, postIdState } from '../atom/modalAtom'
import Modal from 'react-modal'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

export default function CommentModal() {
  const [open, setOpen] = useRecoilState(modalState)
  const [postId] = useRecoilState(postIdState)
  const [post, setPost] = useState({})

  useEffect(() => {
    onSnapshot(doc(db, 'posts', postId), (snapshot) => {
      setPost(snapshot)
    })
  }, [postId, db])

  return (
    <div>
      {open && (
        <Modal
          isOpen={open}
          onRequestClose={() => setOpen(false)}
          className='h-[300px] max-w-lg w-[90%] absolute top-24 left-[50%] translate-x-[-50%] bg-white border-2 border-gray-200 rounded-xl shadow-md'
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
            {post?.data().username}
          </div>
        </Modal>
      )}
    </div>
  )
}
