import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-backgroundLogo">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <h1 className="text-7xl">
            Home
          </h1>
        </div>
      </main>
    );
  }

  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/post/all-post`);
  const posts = await res.json();

  return (
      <main className="flex min-h-screen flex-col items-center p-5 bg-backgroundLogo">
          <div className="z-10 w-full max-w-5xl items-center font-mono text-sm lg:flex">
              <h1 className="text-5xl">Semua kategori</h1>
              <ul>
                  {posts.map((post: any) => (
                      <li key={post.id}>
                        {/* is_anon: {post.isAnon ? "True" : "False"} <br />
                        user: {post.user.name} <br /> 
                        category: {post.category.name} <br />  */}
                        body: {post.body} <br /> 
                        {/* vote_count: {post.voteCount} <br />  
                        created_at: {post.createdAt} <br /> 
                        updated_at: {post.updatedAt} <br />  */}
                        <br />
                    </li>
                  ))}
              </ul>
          </div>
      </main>
  );

  
}