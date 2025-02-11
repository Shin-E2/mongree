"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Clock, Tag, Share2, Heart } from "lucide-react";
import type { Diary, DiaryImage, Comment } from "@prisma/client";
import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import Image from "next/image";

interface DiaryWithRelations extends Omit<Diary, "user"> {
  user: {
    id: string;
    name: string;
    nickname: string;
    profileImage: string | null;
  };
  images: DiaryImage[];
  diaryEmotion: {
    emotion: {
      id: string;
      label: string;
    };
  }[];
  empathies: {
    user: {
      id: string;
      name: string;
      profileImage: string | null;
    };
  }[];
  tags: {
    tag: {
      id: string;
      name: string;
    };
    tagId: string;
  }[];
  comments: Array<
    Comment & {
      user: {
        id: string;
        name: string;
        profileImage: string | null;
      };
      likes: any[];
      replies: Array<
        Comment & {
          user: {
            id: string;
            name: string;
            profileImage: string | null;
          };
          likes: any[];
        }
      >;
    }
  >;
}

interface Props {
  diary: DiaryWithRelations;
  loginUser: {
    id: string;
    name: string;
    profileImage: string | null;
  };
}

// EmpathyButton Component
interface EmpathyButtonProps {
  count: number;
  isEmpathized: boolean;
  onToggle: () => void;
}

// 공감하기 버튼
function EmpathyButton({ count, isEmpathized, onToggle }: EmpathyButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center space-x-2 px-3 md:px-4 py-2 rounded-lg transition-all ${
        isEmpathized
          ? "bg-indigo-100 text-indigo-700"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      <Heart
        className={`w-4 md:w-5 h-4 md:h-5 ${
          isEmpathized ? "fill-current" : ""
        }`}
      />
      <span className="font-medium text-sm md:text-base">공감하기</span>
      <span className="text-xs md:text-sm">({count})</span>
    </button>
  );
}

// CommentItem Component
interface CommentItemProps {
  comment: Comment & {
    user: {
      id: string;
      name: string;
      profileImage: string | null;
    };
    likes: any[];
    replies?: Array<
      Comment & {
        user: {
          id: string;
          name: string;
          profileImage: string | null;
        };
        likes: any[];
      }
    >;
  };
}

// 댓글 목록
export const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <div className="p-4">
      <div className="flex items-start space-x-3 md:space-x-4">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex-shrink-0">
          <img
            src={comment.user.profileImage || DEFAULT_PROFILE_IMAGE}
            alt={comment.user.name}
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
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex items-center text-gray-500 hover:text-gray-700">
                <Heart className="w-4 h-4 mr-1" />
                <span className="text-xs md:text-sm">
                  {comment.likes.length}
                </span>
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
};

// CommentSection Component
interface CommentSectionProps {
  comments: CommentItemProps["comment"][];
  loginUser: {
    id: string;
    name: string;
    profileImage: string | null;
  };
}

function CommentSection({ comments, loginUser }: CommentSectionProps) {
  console.log("image", loginUser);
  return (
    <div className="divide-y">
      {/* 댓글 작성 폼 */}
      <div className="p-4 md:p-6">
        <div className="flex items-start space-x-3 md:space-x-4">
          {/* 사용자 이미지 */}
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0">
            <Image
              src={loginUser.profileImage || DEFAULT_PROFILE_IMAGE}
              alt={loginUser.name}
              width={100}
              height={100}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div className="flex-1">
            <textarea
              placeholder="따뜻한 댓글을 남겨주세요"
              className="w-full px-3 md:px-4 py-2 text-sm md:text-base border rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={3}
            />
            <div className="mt-2 flex justify-end">
              <button className="px-3 md:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-xs md:text-sm">
                댓글 작성
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 댓글 목록 */}
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

// Main DiaryDetailContent Component
export default function DiaryDetailContent({ diary, loginUser }: Props) {
  const router = useRouter();
  const [isEmpathized, setIsEmpathized] = useState(false);
  const [empathyCount, setEmpathyCount] = useState(diary.empathies.length);

  const handleEmpathyToggle = () => {
    setIsEmpathized(!isEmpathized);
    setEmpathyCount((prev) => (isEmpathized ? prev - 1 : prev + 1));
  };

  const mainEmotion = diary.diaryEmotion[0]?.emotion; // 첫 번째 감정 사용

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
          {!diary.isPrivate && (
            <div className="flex items-center space-x-2 md:space-x-3">
              <EmpathyButton
                count={empathyCount}
                isEmpathized={isEmpathized}
                onToggle={handleEmpathyToggle}
              />
              <button
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                title="공유하기"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="px-4 md:px-8 pt-20 pb-24">
        {/* 메인 콘텐츠 카드 */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* 감정 및 제목 섹션 */}
          <div className="p-4 md:p-8 border-b">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center text-xl md:text-2xl">
                    {mainEmotion?.label}
                  </div>
                  <div>
                    <div className="text-base md:text-lg font-medium">
                      {mainEmotion?.label}
                    </div>
                    <div className="flex items-center text-xs md:text-sm text-gray-500">
                      <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                      {new Date(diary.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                  {diary.title}
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                {!diary.isPrivate && (
                  <span className="px-2 md:px-3 py-1 bg-green-100 text-green-800 text-xs md:text-sm rounded-full">
                    공개
                  </span>
                )}
                {isEmpathized && (
                  <span className="flex items-center px-2 md:px-3 py-1 bg-indigo-100 text-indigo-800 text-xs md:text-sm rounded-full">
                    <Heart className="w-3 h-3 fill-current mr-1" />
                    공감됨
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 이미지 섹션 */}
          {diary.images.length > 0 && (
            <div className="border-b">
              <div className="grid grid-cols-3 gap-2 md:gap-4 p-4 md:p-8">
                {diary.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden"
                  >
                    <div className="relative w-full h-full">
                      <img
                        src={image.url}
                        alt={`일기 이미지 ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 본문 섹션 */}
          <div className="p-4 md:p-8">
            <div className="prose max-w-none text-sm md:text-base">
              <pre className="text-gray-700">{diary.content}</pre>
            </div>

            {/* 태그 섹션 추가 */}
            {diary.tags.length > 0 && (
              <div className="mt-6 md:mt-8">
                <div className="flex items-center flex-wrap gap-2">
                  {diary.tags.map((diaryTag) => (
                    <span
                      key={diaryTag.tagId}
                      className="inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs md:text-sm bg-gray-100 text-gray-700"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {diaryTag.tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 공감 섹션 */}
          {!diary.isPrivate && (
            <div className="px-4 md:px-8 py-4 md:py-6 bg-gray-100 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs md:text-sm text-gray-500">
                    {empathyCount}명이 공감했어요
                  </span>
                  <div className="flex -space-x-2">
                    {diary.empathies.slice(0, 3).map((empathy, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white bg-gray-200"
                      >
                        {empathy.user.profileImage && (
                          <img
                            src={empathy.user.profileImage}
                            alt={empathy.user.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                    {empathyCount > 3 && (
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                        +{empathyCount - 3}
                      </div>
                    )}
                  </div>
                </div>
                <EmpathyButton
                  count={empathyCount}
                  isEmpathized={isEmpathized}
                  onToggle={handleEmpathyToggle}
                />
              </div>
            </div>
          )}
        </div>

        {/* 댓글 섹션 */}
        {!diary.isPrivate && (
          <div className="mt-4 md:mt-6 bg-white rounded-2xl shadow-sm mb-16 md:mb-0">
            <CommentSection comments={diary.comments} loginUser={loginUser} />
          </div>
        )}
      </div>
    </div>
  );
}
