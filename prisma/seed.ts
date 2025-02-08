import { PrismaClient } from "@prisma/client";
import { EMOTIONS } from "../src/mock/emotions";

const prisma = new PrismaClient();

async function main() {
  console.log("감정 데이터 생성 시작...");

  // EMOTIONS 상수에서 데이터베이스에 필요한 부분만 사용
  for (const emotion of EMOTIONS) {
    await prisma.emotion.upsert({
      where: { id: emotion.id },
      update: {},
      create: {
        id: emotion.id,
        label: emotion.label,
      },
    });
    console.log(`감정 데이터 생성 완료: ${emotion.label} (${emotion.id})`); 
  } 

  // console.log("감정 데이터 생성 완료!");
}

main()
  .catch((e) => {
    console.error("감정 데이터 생성 중 오류 발생:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
