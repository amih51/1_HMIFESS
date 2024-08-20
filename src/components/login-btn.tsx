import { useSession, signIn, signOut } from "next-auth/react"

export default function LoginBtn() {
  const { data: session } = useSession()
  
  if (session) {
    return (
      <>
        <div className="border">
          <img src={`${session.user?.image}`} alt="profile picture" className="h-8 w-auto" />
        </div>
        <div className="border">
          {session.user?.name} <br />
        </div>
        <div className="border">
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      </>
    )
  }
  
  return (
      <>
        <div className="border">
        Not signed in <br />
        </div>
        <div className="border">
          <button onClick={() => signIn()}>Sign in</button>
        </div>
      </>
  )
}
