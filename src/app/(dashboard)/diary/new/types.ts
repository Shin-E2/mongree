import { PrismaClient } from "@prisma/client";

export type TransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

// 관계 데이터 타입 정의
export interface DiaryRelationsData {
  images?: string[];
  emotions: string[];
  tags: string[];
}

// createDiaryRelations 함수의 매개변수 타입을 명확하게 정의
export interface CreateDiaryRelationsParams {
  tx: TransactionClient;
  diaryId: string;
  data: DiaryRelationsData;
}
