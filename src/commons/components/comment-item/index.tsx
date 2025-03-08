"use client";

import { Heart } from "lucide-react";
import { useState, memo, useCallback, useMemo } from "react";
import Image from "next/image";
import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import type { Comment } from "@prisma/client";

// 댓글 타입 정의
interface CommentWithRelations extends Comment {
  user: {
    id: string;
    name: string;
    profileImage: string | null;
  };
  likes: any[];
  replies?: CommentWithRelations[];
}

// 단일 댓글 아이템 컴포넌트
const CommentItem = memo(({ comment }: { comment: CommentWithRelations }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes.length);

  // 좋아요 토글 핸들러
  const handleLikeToggle = useCallback(() => {
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    // 여기에 API 호출 로직 추가
  }, [isLiked]);

  // 날짜 포맷팅
  const formattedDate = useMemo(() => {
    return new Date(comment.createdAt).toLocaleString();
  }, [comment.createdAt]);

  return (
    <div className="p-4">
      <div className="flex items-start space-x-3 md:space-x-4">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex-shrink-0">
          <Image
            src={comment.user.profileImage || DEFAULT_PROFILE_IMAGE}
            alt={comment.user.name}
            width={40}
            height={40}
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-900 text-sm md:text-base">
                {comment.user.name}
              </span>
              <span className="ml-2 text-xs md:text-sm text-gray-500">
                {formattedDate}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="flex items-center text-gray-500 hover:text-gray-700"
                onClick={handleLikeToggle}
              >
                <Heart
                  className={`w-4 h-4 mr-1 ${
                    isLiked ? "fill-current text-red-500" : ""
                  }`}
                />
                <span className="text-xs md:text-sm">{likeCount}</span>
              </button>
              <button className="text-xs md:text-sm text-gray-500 hover:text-gray-700">
                답글
              </button>
            </div>
          </div>
          <p className="mt-1 text-sm md:text-base text-gray-700">
            {comment.content}
          </p>

          {/* 답글이 있는 경우 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 md:mt-4 space-y-3 md:space-y-4 pl-4 border-l-2 border-gray-100">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

CommentItem.displayName = "CommentItem";
