"use client";

import { useRouter } from "next/navigation";

interface IUseMoveToPageReturn {
  moveToPage: (path: string) => () => void;
}

export const useMoveToPage = (): IUseMoveToPageReturn => {
  const router = useRouter();

  const moveToPage = (path: string) => () => {
    router.push(path);
  };
  return { moveToPage };
};
