"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteComment, toggleCommentLike } from "../comment/action";
import type { DiaryCommentProps, ICommentWithUser } from "./types";
import { CommentBase } from "@/commons/components/comment-base";
import styles from "./styles.module.css";

export function DiaryComment({
  comment,
  diaryId,
  currentUserId,
  onReply,
  isOwner = false,
}: DiaryCommentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isLiked =
    comment.likes?.some((like) => like.user_id === currentUserId) || false;

  const handleLike = () => {
    if (!currentUserId) return;

    startTransition(async () => {
      await toggleCommentLike(comment.id, diaryId);
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (
      !currentUserId ||
      !isOwner ||
      !comment.user ||
      comment.user.id !== currentUserId
    )
      return;

    startTransition(async () => {
      await deleteComment(comment.id, diaryId);
      router.refresh();
    });
  };

  return (
    <CommentBase
      user={comment.user}
      content={comment.content}
      createdAt={comment.created_at}
      likesCount={comment.likes?.length || 0}
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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isLiked =
    reply.likes?.some((like) => like.user_id === currentUserId) || false;
  const isOwner = reply.user?.id === currentUserId;

  const handleLike = () => {
    if (!currentUserId) return;

    startTransition(async () => {
      await toggleCommentLike(reply.id, diaryId);
      router.refresh();
    });
  };

  const handleDelete = () => {
    if (
      !currentUserId ||
      !isOwner ||
      !reply.user ||
      reply.user.id !== currentUserId
    )
      return;

    startTransition(async () => {
      await deleteComment(reply.id, diaryId);
      router.refresh();
    });
  };

  return (
    <CommentBase
      user={reply.user}
      content={reply.content}
      createdAt={reply.created_at}
      likesCount={reply.likes?.length || 0}
      isLiked={isLiked}
      isOwner={isOwner}
      onLike={currentUserId ? handleLike : undefined}
      onDelete={handleDelete}
      cssprop={styles.diary_reply}
    />
  );
}
