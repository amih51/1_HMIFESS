"use client"
import useSWR from 'swr';
import { useState } from 'react';
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/outline';
import LoaderBar from './loader-bar';
import { fetcher } from '@/lib/fetcher';

type VoteStatus = "none" | "upvoted" | "downvoted";

interface VoteBtnProps {
    postId: string;
    userId: string;
    initialVoteCount: number;
}

const VoteBtn: React.FC<VoteBtnProps> = ({ postId, userId, initialVoteCount }) => {
    const { data, error, mutate } = useSWR(`/api/vote/vote-status?postId=${postId}&userId=${userId}`, fetcher);

    const [voteCount, setVoteCount] = useState<number>(initialVoteCount);

    if (error) return <div>Failed to load vote data.</div>;
    if (!data) return <LoaderBar />;

    const voteStatus: VoteStatus = data.voteType === "upvote" ? "upvoted" : data.voteType === "downvote" ? "downvoted" : "none";
    const handleVote = async (type: boolean) => {
        const oldStatus = voteStatus;
        const oldCount = voteCount;

        // Determine new status
        let newStatus: VoteStatus;
        if (type && oldStatus !== "upvoted") {
            newStatus = "upvoted";
        } else if (!type && oldStatus !== "downvoted") {
            newStatus = "downvoted";
        } else {
            newStatus = "none";
        }

        // Optimistic UI update
        let countChange = 0;
        if (oldStatus === "none") {
            countChange = type ? 1 : -1;
        } else if (oldStatus === "upvoted") {
            countChange = type ? -1 : -2;
        } else if (oldStatus === "downvoted") {
            countChange = type ? 2 : 1;
        }

        setVoteCount(oldCount + countChange);
        mutate({ voteType: newStatus === "none" ? "none" : (newStatus === "upvoted" ? "upvote" : "downvote") }, false);

        try {
            const res = await fetch("/api/vote/vote", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    postId,
                    userId,
                    voteType: newStatus === "none" ? null : type,
                }),
            });

            if (!res.ok) {
                // Revert changes if request fails
                setVoteCount(oldCount);
                mutate();
            }
        } catch (error) {
            console.error("Failed to process vote:", error);
            // Revert changes if request fails
            setVoteCount(oldCount);
            mutate();
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
