import useSWR from 'swr';
import { useState, useEffect } from 'react';
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/outline';

type VoteStatus = "none" | "upvoted" | "downvoted";

interface VoteBtnProps {
    postId: string;
    userId: string;
}

const postFetcher = async (url: string, postId: string, userId: string) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ postId, userId }),
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
  
    return response.json();
};

const VoteBtn: React.FC<VoteBtnProps> = ({ postId, userId }) => {
    const { data: vote, mutate: mutate, error: error } = useSWR(
        postId && userId ? ['/api/vote/vote-state', postId, userId] : null,
        ([url, postId, userId]) => postFetcher(url, postId, userId)
    );

    const [voteStatus, setVoteStatus] = useState<VoteStatus>("none");
    const [voteCount, setVoteCount] = useState<number>(0);

    useEffect(() => {
        if (vote) {
            setVoteStatus(vote ? (vote.voteType ? "upvoted" : "downvoted") : "none");
            setVoteCount(vote.voteCount);
        }
    }, [vote]);

    const handleVote = async (type: boolean) => {
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
                const result = await res.json();
                setVoteStatus(result.voteStatus);
                setVoteCount(result.voteCount);

                mutate();
            } else {
                console.error(`Failed to process vote: ${res.statusText}`);
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
