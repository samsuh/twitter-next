import { db } from '../../firebase'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function SignIn() {
  const router = useRouter()
  const onGoogleClick = async () => {
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      const user = auth.currentUser.providerData[0]
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          username: user.displayName.split(' ').join('').toLocaleLowerCase(),
          userImg: user.photoURL,
          uid: user.uid,
          timestamp: serverTimestamp(),
        })
      }
      //redirect back to homepage after successfully signing in
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='flex justify-center mt-20 space-x-4'>
      <img
        src='https://cdn0.iconfinder.com/data/icons/popular-social-media-colored/48/JD-14-512.png'
        alt='twitter mobile image'
        className='hidden object-cover md:w-44 md:h-80 rotate-6 md:inline-flex'
      />
      <div>
        <div className='flex flex-col items-center'>
          <Image
            src='/twitter-logo.png'
            alt='twitter logo'
            width={500}
            height={500}
            className='w-36 object-cover'
          />
          <p className='text-center text-sm italic my-10'>
            This app is just for learning. Pls dont sue me, Elon.
          </p>
          <button
            className='bg-red-400 rounded-lg p-3 text-white hover:bg-red-500'
            onClick={onGoogleClick}
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  )
}
