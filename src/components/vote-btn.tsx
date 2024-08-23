"use client";

import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useState } from 'react';
import LoaderBar from './loader-bar';

type VoteType = boolean; 
type VoteStatus = "none" | "upvoted" | "downvoted";

interface VoteBtnProps {
    postId: string;
    userId: string;
}

const VoteBtn: React.FC<VoteBtnProps> = ({ postId, userId }) => {
    const { data: voteData, error: voteError } = useSWR(`/api/vote/vote-status?postId=${postId}&userId=${userId}`, fetcher);
    const { data: postData, error: postError } = useSWR(`/api/post/${postId}`, fetcher);

    const [voteStatus, setVoteStatus] = useState<VoteStatus>(voteData?.voteType ? "upvoted" : voteData?.voteType === false ? "downvoted" : "none");
    const [voteCount, setVoteCount] = useState<number>(postData?.voteCount || 0);

    if (voteError || postError) return <div>Failed to load vote data.</div>;
    if (!voteData || !postData) return <LoaderBar />;

    const handleVote = async (type: VoteType) => {
        try {
            const res = await fetch("/api/vote/vote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    postId,
                    userId,
                    voteType: type,
                }),
            });

            if (res.ok) {
                setVoteStatus(voteStatus === (type ? "upvoted" : "downvoted") ? "none" : (type ? "upvoted" : "downvoted"));

                const updatedCountRes = await fetch(`/api/post/${postId}`);
                const { voteCount } = await updatedCountRes.json();
                setVoteCount(voteCount);
            }
        } catch (error) {
            console.error("Failed to process vote:", error);
        }
    };

    return (
        <>
            <div >
                <button className='bg-blue-400 p-1 m-5 rounded'
                    onClick={() => handleVote(true)} 
                    style={{ color: voteStatus === "upvoted" ? "red" : "black" }}
                >
                    Upvote
                </button>
                <button className='bg-red-400 m-5 p-1 rounded'
                    onClick={() => handleVote(false)} 
                    style={{ color: voteStatus === "downvoted" ? "red" : "black" }}
                >
                    Downvote
                </button>
            </div>
            <div className='bg-green-400 m-5 p-1 rounded'>
                Vote Count: {voteCount}
            </div>
        </>
    );
};

export default VoteBtn;
