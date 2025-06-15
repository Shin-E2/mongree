"use client";

import React from "react";

import { HeaderStandardMFull } from "@/commons/components/header";
import { MapPin, Search } from "lucide-react";
import styles from "./styles.module.css";

export default function CounselorListPage() {
  return (
    <div className={styles.mainContainer}>
      <HeaderStandardMFull
        title="상담사 찾기"
        description="신뢰할 수 있는 전문 상담사를 만나보세요"
      />
      <div className={styles.contentWrapper}>
        {/* search and Filter */}
        <div className={styles.searchFilterSection}>
          <div className={styles.searchFilterFlexWrap}>
            {/* Search Bar */}
            <div className={styles.searchBarWrapper}>
              <div className={styles.searchBarRelative}>
                <input
                  type="text"
                  placeholder="상담사 이름 또는 키워드로 검색"
                  className={styles.searchInput}
                />
                <Search className={styles.searchIcon} />
              </div>
            </div>

            {/* Location Filter */}
            <div className={styles.locationFilterWrapper}>
              <div className={styles.locationFilterRelative}>
                <select className={styles.locationSelect}>
                  <option value="">지역 선택</option>
                  <option value="서울">서울</option>
                  <option value="경기">경기</option>
                  <option value="인천">인천</option>
                </select>
                <MapPin className={styles.mapPinIcon} />
              </div>
            </div>
          </div>
        </div>
        {/* 상담사 리스트 */}
        <div className={styles.counselorListSection}>
          <div className={styles.counselorListGrid}>
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div className={styles.counselorCard} key={index}>
                <div className={styles.cardImageRelative}>
                  <img
                    src="/image/emotions/happy.svg"
                    alt="상담사 프로필"
                    className={styles.cardImage}
                  />
                  <div className={styles.statusBadgeWrapper}>
                    <span className={styles.statusBadge}>상담 가능</span>
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.counselorName}>김상담 상담사</h3>
                    <div className={styles.starRatingWrapper}>
                      <span className={styles.starIcon}>★</span>
                      <span className={styles.ratingNumber}>4.8</span>
                    </div>
                  </div>

                  <p className={styles.description}>
                    10년 경력의 전문 상담사입니다. 우울증, 불안장애, 대인관계 등
                    전문적인 상담을 제공합니다.
                  </p>

                  <div className={styles.tagsWrapper}>
                    <span className={styles.tag}>#우울증</span>
                    <span className={styles.tag}>#불안장애</span>
                    <span className={styles.tag}>#대인관계</span>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.locationText}>서울시 강남구</div>
                    <button className={styles.detailButton}>자세히 보기</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
