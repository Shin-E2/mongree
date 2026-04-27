import { useOptimistic, useTransition } from "react";
import { togglePublicEmpathy } from "./action";
import type { PublicDiaryCardProps } from "./types";

export default function usePublicDiaryCard({
  diary,
  loginUser,
}: PublicDiaryCardProps) {
  const [isPending, startTransition] = useTransition();
  const initialEmpathies = diary.empathies ?? [];
  const isEmpathized = initialEmpathies.some(
    (empathy) => empathy.user?.id === loginUser?.id
  );
  const [optimisticData, updateOptimisticData] = useOptimistic(
    {
      empathies: initialEmpathies,
      count: diary._count?.empathies ?? 0,
      isEmpathized,
    },
    (
      state,
      update: {
        empathies: typeof initialEmpathies;
        count: number;
        isEmpathized: boolean;
      }
    ) => ({
      ...state,
      ...update,
    })
  );

  const handleEmpathyToggle = () => {
    if (!loginUser) return;

    startTransition(async () => {
      const nextIsEmpathized = !optimisticData.isEmpathized;
      const nextCount = Math.max(
        0,
        optimisticData.count + (nextIsEmpathized ? 1 : -1)
      );
      const nextEmpathies = nextIsEmpathized
        ? [
            {
              id: `temp-${loginUser.id}`,
              createdAt: new Date(),
              user: loginUser,
            },
            ...optimisticData.empathies.filter(
              (empathy) => empathy.user?.id !== loginUser.id
            ),
          ].slice(0, 3)
        : optimisticData.empathies.filter(
            (empathy) => empathy.user?.id !== loginUser.id
          );

      updateOptimisticData({
        empathies: nextEmpathies,
        count: nextCount,
        isEmpathized: nextIsEmpathized,
      });

      const result = await togglePublicEmpathy(diary.id);

      if (!result.success) {
        updateOptimisticData({
          empathies: initialEmpathies,
          count: diary._count?.empathies ?? 0,
          isEmpathized,
        });
        return;
      }

      updateOptimisticData({
        empathies: result.empathies ?? nextEmpathies,
        count: result.count ?? nextCount,
        isEmpathized: result.isEmpathized ?? nextIsEmpathized,
      });
    });
  };

  return {
    optimisticData,
    isPending,
    handleEmpathyToggle,
  };
}
