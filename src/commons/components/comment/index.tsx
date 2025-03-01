import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import { formatToTimeAgo } from "@/lib/utils";
import { Heart, Trash2 } from "lucide-react";
import Image from "next/image";
import { useTransition } from "react";
import { deleteComment, toggleCommentLike } from "./action";
import type {
  ICommentBaseProps,
  DiaryCommentProps,
  ICommentWithUser,
} from "./types";
import styles from "./styles.module.css";

export const CommentBase = ({
  profileImage,
  name,
  content,
  createdAt,
  likesCount,
  isLiked,
  isOwner,
  onLike,
  onReply,
  onDelete,
  cssprop,
  className,
}: ICommentBaseProps) => {
  return (
    <div className={`${cssprop} ${className}`}>
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <Image
            src={profileImage || DEFAULT_PROFILE_IMAGE}
            alt={name}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-semibold text-gray-900">{name}</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-gray-500 text-sm">
                {formatToTimeAgo(createdAt.toISOString())}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {onLike && (
                <button
                  onClick={onLike}
                  className={`flex items-center ${
                    isLiked ? "text-red-500" : "text-gray-500"
                  } hover:text-red-700`}
                >
                  <Heart
                    className={`w-4 h-4 min-w-4 min-h-4 ${
                      isLiked ? "fill-current" : ""
                    }`}
                  />
                  <span className="ml-1 text-sm">{likesCount}</span>
                </button>
              )}
              {onReply && (
                <button
                  onClick={onReply}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  답글 달기
                </button>
              )}
              {isOwner && (
                <button
                  onClick={onDelete}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="삭제하기"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <p className="break-words whitespace-pre-line text-gray-700 text-base max-w-full mt-2">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

export function DiaryComment({
  comment,
  diaryId,
  currentUserId,
  onReply,
  isOwner = false,
}: DiaryCommentProps) {
  const [isPending, startTransition] = useTransition();
  const isLiked = comment.likes.some((like) => like.userId === currentUserId);

  const handleLike = () => {
    if (!currentUserId) return;

    startTransition(async () => {
      await toggleCommentLike(comment.id, diaryId);
    });
  };

  const handleDelete = () => {
    if (!currentUserId || !isOwner) return;

    startTransition(async () => {
      await deleteComment(comment.id, diaryId);
    });
  };

  return (
    <CommentBase
      profileImage={comment.user.profileImage}
      name={comment.user.name}
      content={comment.content}
      createdAt={comment.createdAt}
      likesCount={comment.likes.length}
      isLiked={isLiked}
      isOwner={isOwner}
      onLike={currentUserId ? handleLike : undefined}
      onReply={onReply}
      onDelete={handleDelete}
      cssprop={styles.diary_comment}
    />
  );
}

export function DiaryReply({
  reply,
  diaryId,
  currentUserId,
}: {
  reply: ICommentWithUser;
  diaryId: string;
  currentUserId?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const isLiked = reply.likes.some((like) => like.userId === currentUserId);
  const isOwner = reply.user.id === currentUserId;

  const handleLike = () => {
    if (!currentUserId) return;

    startTransition(async () => {
      await toggleCommentLike(reply.id, diaryId);
    });
  };

  const handleDelete = () => {
    if (!currentUserId || !isOwner) return;

    startTransition(async () => {
      await deleteComment(reply.id, diaryId);
    });
  };

  return (
    <CommentBase
      profileImage={reply.user.profileImage}
      name={reply.user.name}
      content={reply.content}
      createdAt={reply.createdAt}
      likesCount={reply.likes.length}
      isLiked={isLiked}
      isOwner={isOwner}
      onLike={currentUserId ? handleLike : undefined}
      onDelete={handleDelete}
      cssprop={styles.diary_reply}
    />
  );
}
