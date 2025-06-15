import { useOptimistic, useState, useTransition } from "react";
import { togglePublicEmpathy } from "./action";
import type { PublicDiaryCardProps } from "./types";

export default function usePublicDiaryCard({
  diary,
  loginUser,
}: PublicDiaryCardProps) {
  // const [isPending, startTransition] = useTransition();

  // // 현재 사용자가 공감했는지 확인
  // const isEmpathized = diary.empathies.some(
  //   (empathy) => empathy.user.id === loginUser?.id
  // );

  // // 낙관적 UI 업데이트를 위한 상태
  // const [optimisticData, updateOptimisticData] = useOptimistic(
  //   {
  //     empathies: diary.empathies,
  //     count: diary._count?.empathies ?? 0,
  //     isEmpathized: isEmpathized,
  //   },\n  //   (
  //     state,
  //     update: {
  //       empathies: typeof diary.empathies;
  //       count: number;
  //       isEmpathized: boolean;
  //     }
  //   ) => ({
  //     ...state,
  //     empathies: update.empathies,
  //     count: update.count,
  //     isEmpathized: update.isEmpathized,
  //   })
  // );

  // const handleEmpathyToggle = (e: React.MouseEvent) => {
  //   e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
  //   console.log("공감 버튼 클릭됨");

  //   if (!loginUser) return;

  //   startTransition(async () => {
  //     // 낙관적 업데이트

  //     console.log("공감 토글 작동하는거 맞음?");

  //     const newIsEmpathized = !optimisticData.isEmpathized;
  //     const newCount = optimisticData.count + (newIsEmpathized ? 1 : -1);

  //     let newEmpathies = [...optimisticData.empathies];

  //     if (newIsEmpathized) {
  //       // 공감 추가
  //       const newEmpathy = {
  //         id: "temp-id",
  //         user: loginUser,
  //         createdAt: new Date(),
  //       };
  //       newEmpathies = [newEmpathy, ...newEmpathies.slice(0, 2)]; // 최대 3개만 표시
  //     } else {
  //       // 공감 제거
  //       newEmpathies = newEmpathies.filter((e) => e.user.id !== loginUser.id);
  //     }

  //     // 낙관적 UI 업데이트
  //     updateOptimisticData({
  //       empathies: newEmpathies,
  //       count: newCount,
  //       isEmpathized: newIsEmpathized,
  //     });

  //     console.log("공감 토글 후 상태:", {
  //       empathies: newEmpathies,
  //       count: newCount,
  //       isEmpathized: newIsEmpathized,
  //     });

  //     // 서버 액션 호출
  //     const result = await togglePublicEmpathy(diary.id);

  //     if (!result.success) {
  //       // 실패 시 원래 상태로 되돌림
  //       updateOptimisticData({
  //         empathies: diary.empathies,
  //         count: diary._count.empathies,
  //         isEmpathized: isEmpathized,
  //       });
  //     }
  //   });
  // };

  return {
    optimisticData: {
      empathies: diary.empathies,
      count: diary._count?.empathies ?? 0,
      isEmpathized: diary.empathies.some(
        (empathy) => empathy.user.id === loginUser?.id
      ),
    },
    isPending: false,
    handleEmpathyToggle: () => {},
  };
}
