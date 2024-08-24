"use client";

import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useState } from 'react';
import LoaderBar from './loader-bar';
import { HandThumbUpIcon, HandThumbDownIcon, ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';

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
        <div className='flex flex-row place-items-center'>
            <div>
                <button className='bg-gray-300 px-4 py-2 rounded-l-full hover:bg-gray-400'
                    onClick={() => handleVote(true)} 
                    style={{ color: voteStatus === "upvoted" ? "blue" : "black" }}
                >
                    <HandThumbUpIcon className='w-5 h-5'/>
                </button>
                <button className='bg-gray-300 px-4 py-2 rounded-r-full hover:bg-gray-400'
                    onClick={() => handleVote(false)} 
                    style={{ color: voteStatus === "downvoted" ? "red" : "black" }}
                >
                    <HandThumbDownIcon className='w-5 h-5'/>
                </button>
            </div>
            <div className='border border-gray-400 m-2 py-1.5 px-3 text-sm rounded-full text-gray-400'>
                Vote Count: <b className='text-black'> {voteCount} </b> 
            </div>
        </div>
        </>
    );
};

export default VoteBtn;
