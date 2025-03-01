"use client";

import { DiaryComment, DiaryReply } from "@/commons/components/comment";
import { CommentForm } from "@/commons/components/comment-form";
import { ModalStandardFitFit } from "@/commons/components/modal";
import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import { formatToTimeAgo } from "@/lib/utils";
import { EMOTIONS } from "@/mock/emotions";
import { ChevronLeft, Heart, Share2, Tag, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import { deleteDiary, toggleEmpathy } from "./action";
import type { IDiaryDetailContentProps } from "./types";

export default function DiaryDetailContent({
  diary,
  loginUser,
}: IDiaryDetailContentProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isOwner = diary.user.id === loginUser?.id;
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 공감 관련 상태 관리
  const [optimisticEmpathies, addOptimisticEmpathy] = useOptimistic(
    diary.empathies,
    (state, newEmpathy: (typeof diary.empathies)[0]) => {
      if (state.some((e) => e.user.id === newEmpathy.user.id)) {
        return state.filter((e) => e.user.id !== newEmpathy.user.id);
      }
      return [newEmpathy, ...state.slice(0, 2)]; // 최대 3개만 표시
    }
  );

  const isEmpathized = diary.empathies.some(
    (empathy) => empathy.user.id === loginUser?.id
  );

  const handleEmpathyToggle = async () => {
    if (!loginUser) return;

    startTransition(async () => {
      // 낙관적 업데이트
      const optimisticEmpathy = {
        id: "temp-id",
        user: loginUser,
        createdAt: new Date(),
      };
      addOptimisticEmpathy(optimisticEmpathy);

      const result = await toggleEmpathy(diary.id);
      if (!result.success) {
        // 실패 시 롤백
        addOptimisticEmpathy(optimisticEmpathy);
      }
    });
  };

  const handleDelete = async () => {
    if (!isOwner) return;

    if (!confirm("일기를 삭제하시겠습니까?")) return;

    startTransition(async () => {
      const result = await deleteDiary(diary.id);
      if (result.success) {
        router.push("/diary");
      } else {
        alert(result.error || "삭제에 실패했습니다");
      }
    });
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      {/* 상단 네비게이션 */}
      <div className="bg-white fixed top-0 left-0 right-0 z-10 border-b md:ml-64">
        <div className="w-full flex items-center justify-between h-14 px-4 md:px-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="hidden xs:inline">돌아가기</span>
          </button>
          <div className="flex items-center gap-2">
            {!diary.isPrivate && (
              <button
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                title="공유하기"
              >
                <Share2 className="w-5 h-5" />
              </button>
            )}
            {isOwner && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full transition-colors"
                title="삭제하기"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="px-4 md:px-8 pt-20 pb-24">
        {/* 메인 콘텐츠 카드 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* 작성자 및 감정 섹션 */}
          <div className="p-4 md:p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Image
                  src={diary.user.profileImage || DEFAULT_PROFILE_IMAGE}
                  alt={diary.user.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-gray-900">
                    {diary.user.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatToTimeAgo(diary.createdAt.toISOString())}
                  </div>
                </div>
              </div>
              {!diary.isPrivate && (
                <span className="px-2.5 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  공개
                </span>
              )}
            </div>

            {/* 감정 뱃지 */}
            <div className="flex flex-wrap gap-2 mb-4">
              {diary.diaryEmotion.map(({ emotion }) => {
                const emotionConfig = EMOTIONS.find((e) => e.id === emotion.id);
                return (
                  <span
                    key={emotion.id}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm
                     ${emotionConfig?.bgColor} ${emotionConfig?.textColor}`}
                  >
                    <Image
                      src={emotionConfig?.image!}
                      alt={emotion.label}
                      width={100}
                      height={100}
                      className="w-4 h-4 mr-1.5"
                    />
                    {emotion.label}
                  </span>
                );
              })}
            </div>

            {/* 제목 */}
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {diary.title}
            </h1>
          </div>

          {/* 이미지 섹션 */}
          {diary.images.length > 0 && (
            <div className="border-b">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 md:p-6">
                {diary.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                  >
                    <Image
                      src={image.url}
                      alt={`일기 이미지 ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 본문 섹션 */}
          <div className="p-4 md:p-6">
            <div className="prose max-w-none">
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {diary.content}
              </div>
            </div>

            {/* 태그 섹션 */}
            {diary.tags.length > 0 && (
              <div className="mt-6">
                <div className="flex flex-wrap gap-2">
                  {diary.tags.map((diaryTag) => (
                    <span
                      key={diaryTag.tagId}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                    >
                      <Tag className="w-3 h-3 mr-1.5" />
                      {diaryTag.tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 공감 섹션 */}
          {!diary.isPrivate && (
            <div className="px-4 md:px-6 py-4 bg-gray-50 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    {optimisticEmpathies.slice(0, 3).map((empathy) => (
                      <div
                        key={empathy.id}
                        className="w-7 h-7 rounded-full border-2 border-white overflow-hidden"
                      >
                        <Image
                          src={
                            empathy.user.profileImage || DEFAULT_PROFILE_IMAGE
                          }
                          alt={empathy.user.name}
                          width={28}
                          height={28}
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {optimisticEmpathies.length}명이 공감했어요
                  </span>
                </div>
                <button
                  onClick={handleEmpathyToggle}
                  disabled={isPending || !loginUser}
                  className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg transition-all ${
                    isEmpathized
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } ${!loginUser && "opacity-50 cursor-not-allowed"}`}
                >
                  <Heart
                    className={`w-4 md:w-5 h-4 md:h-5 ${
                      isEmpathized ? "fill-current" : ""
                    }`}
                  />
                  <span className="font-medium text-sm md:text-base">
                    공감하기
                  </span>
                  <span className="text-xs md:text-sm">
                    ({optimisticEmpathies.length})
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 댓글 섹션 */}
        {!diary.isPrivate && (
          <div className="mt-4 md:mt-6 bg-white rounded-2xl shadow-sm mb-16 md:mb-0">
            <div className="p-4 md:p-6 border-b">
              <h2 className="text-lg font-semibold">
                댓글 {diary.comments.length}개
              </h2>
            </div>

            {loginUser && <CommentForm user={loginUser} diaryId={diary.id} />}

            <div className="divide-y">
              {diary.comments.map((comment) => (
                <div key={comment.id}>
                  <DiaryComment
                    comment={comment}
                    diaryId={diary.id}
                    currentUserId={loginUser?.id}
                    onReply={() => setShowReplyForm(comment.id)}
                    isOwner={comment.user.id === loginUser?.id}
                  />

                  {showReplyForm === comment.id && loginUser && (
                    <div className="ml-6 md:ml-12">
                      <CommentForm
                        user={loginUser}
                        diaryId={diary.id}
                        parentId={comment.id}
                        isReply
                        onSuccess={() => {
                          setShowReplyForm(null);
                        }}
                      />
                    </div>
                  )}

                  {comment.replies?.map((reply) => (
                    <div
                      key={reply.id}
                      className="ml-5 md:ml-12 border-gray-100 p-4 pt-0"
                    >
                      <DiaryReply
                        reply={reply}
                        diaryId={diary.id}
                        currentUserId={loginUser?.id}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {diary.comments.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                첫 번째 댓글을 남겨보세요!
              </div>
            )}
          </div>
        )}
      </div>
      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <ModalStandardFitFit
          title="일기 삭제"
          discription={`일기를 삭제하시겠습니까?\n삭제된 일기는 복구할 수 없습니다.`}
          okButton={{
            text: "삭제",
            onClick: handleDelete,
          }}
          cancelButton={{
            text: "취소",
            onClick: () => setShowDeleteModal(false),
          }}
        />
      )}
    </div>
  );
}
