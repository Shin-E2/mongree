"use client";

import React, { useState } from "react";
import { Star, MapPin, Phone, Mail, Clock } from "lucide-react";
import { ImageThumbnail } from "@/commons/components/image-thumbnail";
import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import InfoItem from "@/commons/components/info-item";
import UserProfileHeader from "@/commons/components/user-profile-header";
import StarRating from "@/commons/components/star-rating";
import FileUploadInput from "@/commons/components/file-upload-input";
import styles from "./styles.module.css";

export default function CounselorProfilePage() {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  return (
    <div className={styles.mainContainer}>
      {/* Profile 상담사 */}
      <div className={styles.profileSection}>
        <div className={styles.profileContentWrapper}>
          <div className={styles.profileLayout}>
            {/* 프로필 이미지 */}
            <div className={styles.profileImageContainer}>
              <ImageThumbnail
                src={DEFAULT_PROFILE_IMAGE}
                alt="상담사 프로필"
                width={192}
                height={192}
                className={styles.profileImage}
                shape="square"
              />
            </div>

            <div className={styles.profileInfoWrapper}>
              <div className={styles.profileHeader}>
                <h1 className={styles.counselorName}>신상담 상담사</h1>
                <div className={styles.starRatingWrapper}>
                  <StarRating
                    rating={4.8}
                    size="medium"
                    className={styles.backIcon}
                  />
                  <span className={styles.ratingText}>4.8</span>
                  <span className={styles.reviewCountText}>(123개 리뷰)</span>
                </div>
              </div>

              <p className={styles.description}>
                500년 경력의 전문 상담사입니다. 우울증, 불안장애, 대인관계 등
                전문적인 상담을 제공합니다.
              </p>

              <div className={styles.infoGrid}>
                <InfoItem
                  icon={<MapPin className={styles.iconBase} />}
                  text="서울시 강남구"
                />
                <InfoItem
                  icon={<Phone className={styles.iconBase} />}
                  text="010-1234-5678"
                />
                <InfoItem
                  icon={<Mail className={styles.iconBase} />}
                  text="counselor@example.com"
                />
                <InfoItem
                  icon={<Clock className={styles.iconBase} />}
                  text="평일 10:00 - 19:00"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContentSection}>
        <div className={styles.mainContentGrid}>
          {/* 소개 정보 */}
          <div className={styles.introSectionColumn}>
            <div className={styles.introCard}>
              <h2 className={styles.introTitle}>소개</h2>
              <p className={styles.introContent}>
                집에 일찍 가고 싶은 사람들을 치료해줘용 ❤️
              </p>
            </div>
          </div>

          {/* Right: 지도, 예약 - 모바일에서는 소개 아래, 데스크탑에서는 우측에 sticky */}
          <div className={styles.sidebarColumn}>
            <div className={styles.mapReservationCard}>
              <div className={styles.mapPlaceholder}>map</div>
              <button className={styles.reserveButton}>상담 예약하기</button>
            </div>
          </div>

          {/* 리뷰 섹션 */}
          <div className={styles.reviewSectionColumn}>
            <div className={styles.reviewCard}>
              <h2 className={styles.reviewTitle}>리뷰</h2>
              {/* Review List */}
              <div className={styles.reviewListContainer}>
                {[1, 2, 3].map((index) => (
                  <div key={index} className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <UserProfileHeader
                        profileImage={DEFAULT_PROFILE_IMAGE}
                        username="김토닥"
                        createdAt="2024.03.15"
                      />
                      <StarRating rating={5} size="small" />
                    </div>
                    <p className={styles.reviewContent}>
                      상담이 너무 마음에 들었어요. 항상 집에 일찍 가고 싶었는데
                      상담 후 집에 덜 그립고 강일역 지박령이 되었습니다. 너무
                      행복해요
                    </p>
                  </div>
                ))}
              </div>
              <div className={styles.reviewButtonContainer}>
                <button
                  onClick={() => setShowReviewForm(true)}
                  className={styles.writeReviewButton}
                >
                  리뷰 작성
                </button>
                {showReviewForm && (
                  <div className={styles.reviewFormContainer}>
                    <h3 className={styles.reviewFormTitle}>리뷰 작성</h3>
                    <div className={styles.formSpaceY}>
                      <div>
                        <label className={styles.formLabel}>별점</label>
                        <StarRating
                          rating={reviewRating}
                          onRatingChange={setReviewRating}
                          size="large"
                        />
                      </div>

                      <div>
                        <label className={styles.formLabel}>리뷰 내용</label>
                        <textarea
                          className={styles.textAreaInput}
                          rows={4}
                          placeholder="상담은 어떠셨나요?"
                        />
                      </div>

                      <FileUploadInput
                        label="영수증 첨부"
                        onFileChange={setReceiptFile}
                        placeholder={
                          receiptFile
                            ? receiptFile.name
                            : "클릭하여 영수증 이미지를 업로드하세요"
                        }
                        accept="image/*"
                      />

                      <div className={styles.formButtons}>
                        <button
                          onClick={() => setShowReviewForm(false)}
                          className={styles.cancelFormButton}
                        >
                          취소
                        </button>
                        <button className={styles.submitReviewButton}>
                          등록하기
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
