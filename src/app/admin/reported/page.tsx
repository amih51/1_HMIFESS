import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface ReportedContent {
  id: string;
  type: 'post' | 'comment';
  body: string;
  user: {
    name: string;
  };
}

const ReportedContentPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>([]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || !(session.user as any).isAdmin) {
      router.push('/');
      return;
    }

    const fetchReportedContent = async () => {
      const res = await fetch('/api/admin/reported-content');
      const data = await res.json();
      setReportedContent(data);
    };

    fetchReportedContent();
  }, [session, status, router]);

  if (status === 'loading') return <div>Loading...</div>;

  return (
    <div>
      <h1>Reported Content</h1>
      {reportedContent.map((content) => (
        <div key={content.id} className="border p-4 my-2 max-w-md">
          <p>Type: {content.type}</p>
          <p>User: {content.user.name}</p>
          <p>Content: {content.body}</p>
          <button onClick={() => {/* Handle unreport */}}>Unreport</button>
          <button onClick={() => {/* Handle delete */}}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default ReportedContentPage;