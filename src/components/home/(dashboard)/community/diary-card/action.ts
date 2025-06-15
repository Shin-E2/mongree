"use server";

import { getUser } from "@/lib/get-user";
import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase-server"; // 서버용 Supabase 클라이언트 임포트

// 공감하기
export async function togglePublicEmpathy(diaryId: string) {
  try {
    const user = await getUser();
    const supabase = await createClient(); // Supabase 클라이언트 생성

    // 기존 공감 확인
    const { data: existingEmpathy, error: checkError } = await supabase
      .from('DiaryEmpathy') // 공감 테이블
      .select('id')
      .eq('userId', user.id)
      .eq('diaryId', diaryId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116: "not found"
      console.error('Supabase 공감 확인 오류:', checkError);
      throw new Error('공감 상태 확인 중 오류가 발생했습니다.');
    }

    if (existingEmpathy) {
      // 공감 취소
      const { error: deleteError } = await supabase
        .from('DiaryEmpathy')
        .delete()
        .eq('id', existingEmpathy.id);

      if (deleteError) {
        console.error('Supabase 공감 삭제 오류:', deleteError);
        throw new Error('공감 취소 중 오류가 발생했습니다.');
      }
    } else {
      // 공감하기
      const { error: createError } = await supabase
        .from('DiaryEmpathy')
        .insert([{ userId: user.id, diaryId }]);

      if (createError) {
        console.error('Supabase 공감 생성 오류:', createError);
        throw new Error('공감 처리 중 오류가 발생했습니다.');
      }
    }

    // 공감 관련 태그 재검증
    revalidateTag(`public-diary-${diaryId}`);
    revalidateTag(`public-diaries`);

    // 업데이트된 공감 목록 (최근 3개) 및 개수 조회
    const { data: updatedEmpathies, error: fetchEmpathiesError } = await supabase
      .from('DiaryEmpathy')
      .select(
        `
        id,
        createdAt,
        user ( // User 테이블 조인
          id,
          name,
          profileImage
        )
        `
      )
      .eq('diaryId', diaryId)
      .order('createdAt', { ascending: false })
      .limit(3);

    // 공감 개수 조회
    const { count: empathyCount, error: countError } = await supabase
      .from('DiaryEmpathy')
      .select('id', { count: 'exact' })
      .eq('diaryId', diaryId);

    if (fetchEmpathiesError) {
      console.error('Supabase 공감 목록 조회 오류:', fetchEmpathiesError);
      // 오류 발생 시에도 부분적인 결과 반환 또는 오류 처리 강화
    }

    if (countError) {
      console.error('Supabase 공감 개수 조회 오류:', countError);
      // 오류 발생 시에도 부분적인 결과 반환 또는 오류 처리 강화
    }

    // 반환 형식에 맞게 데이터 가공 (필요시)
    const formattedEmpathies = updatedEmpathies?.map(empathy => ({
      id: empathy.id,
      createdAt: empathy.createdAt,
      user: empathy.user, // User 객체는 그대로 사용
    })) || [];

    return {
      success: true,
      empathies: formattedEmpathies,
      count: empathyCount || 0, // 개수 오류 시 0 반환
      isEmpathized: !existingEmpathy,
    };
  } catch (error) {
    return {
      success: false,
      error: "공감 처리에 실패했습니다",
    };
  }
}
