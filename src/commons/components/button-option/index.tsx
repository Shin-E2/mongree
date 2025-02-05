import Image from "next/image";
import styles from "./styles.module.css";
import type {
  IButtonOptionBaseProps,
  IButtonOptionByProfileButtonProps,
  IButtonOptionCommonProps,
} from "./types";
import Link from "next/link";

// 아이콘과 제목이 붙어있는 버튼 컴포넌트
export default function ButtonOptionBase({
  icon,
  title,
  description,
  cssprop,
  onClick,
  isProfile,
  titleColor,
  href,
}: IButtonOptionBaseProps) {
  const ButtonContent = () => (
    <>
      {icon}
      {isProfile ? (
        <div className={styles.common__textBox}>
          <span className={styles.common__textBox__title}>{title}</span>
          <span className={styles.common_textBox__description}>
            {description}
          </span>
        </div>
      ) : (
        <span className={titleColor}>{title}</span>
      )}
    </>
  );

  // 링크 태그인 경우
  if (href) {
    return (
      <Link href={href} className={`${styles.common} ${cssprop}`}>
        <ButtonContent />
      </Link>
    );
  }

  return (
    <button className={`${styles.common} ${cssprop}`} onClick={onClick}>
      <ButtonContent />
    </button>
  );
}

// 홈에서 보이는 sidebar안에 있는 profileButton
export const ButtonOptionByProfileButton = ({
  imageUrl,
  ...rest
}: IButtonOptionByProfileButtonProps) => {
  return (
    <ButtonOptionBase
      {...rest}
      cssprop={styles.profile}
      icon={
        <div className={styles.profile__div}>
          <Image
            src={imageUrl}
            alt="profile-image"
            width={40}
            height={40}
            className={styles.profile__div__image}
          />
        </div>
      }
    />
  );
};

// 아이콘과 텍스트있는 버튼
export const ButtonOptionStandardSFull = ({
  ...rest
}: IButtonOptionCommonProps) => {
  return <ButtonOptionBase {...rest} />;
};

// 일기 등록하기 뒤로가기 버튼
export const ButtonOptionDiaryNewPrev = ({
  ...rest
}: IButtonOptionCommonProps) => {
  return <ButtonOptionBase {...rest} cssprop={styles.diary_new_prev} />;
};
