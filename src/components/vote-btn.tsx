"use client"
import useSWR from 'swr';
import { useState } from 'react';
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/outline';
import LoaderBar from './loader-bar';
import { fetcher } from '@/lib/fetcher';

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
        <div className='flex flex-row place-items-center'>
            <div className='flex flex-row'>
                <button className='bg-gray-300 pl-4 pr-2 py-2 rounded-l-full hover:bg-gray-400'
                    onClick={() => handleVote(true)} 
                    style={{ color: voteStatus === "upvoted" ? "blue" : "black" }}
                >
                    <ArrowUpCircleIcon className='w-5 h-5'/>
                </button>
                <div className='bg-gray-300 px-2 py-2'>
                    {voteCount}
                </div> 
                <button className='bg-gray-300 pl-2 pr-4 py-2 rounded-r-full hover:bg-gray-400'
                    onClick={() => handleVote(false)} 
                    style={{ color: voteStatus === "downvoted" ? "red" : "black" }}
                >
                    <ArrowDownCircleIcon className='w-5 h-5'/>
                </button>
            </div>
        </div>
    );
};

export default VoteBtn;
