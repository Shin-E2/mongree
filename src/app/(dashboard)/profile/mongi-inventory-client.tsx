"use client";

import { Cloud, Lock, Sparkles } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import styles from "./styles.module.css";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  slot: string;
  assetUrl: string | null;
  pricePoints: number;
  requiresPro: boolean;
  isDefault: boolean;
  owned: boolean;
  equipped: boolean;
}

const slotLabels: Record<string, string> = {
  head: "머리",
  neck: "목",
  body: "몸",
};

interface MongiInventoryClientProps {
  onEquipped?: () => void;
}

export default function MongiInventoryClient({ onEquipped }: MongiInventoryClientProps = {}) {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [cloudPoints, setCloudPoints] = useState(0);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const ownedItems = items.filter((item) => item.owned);
  const shopItems = items.filter((item) => !item.owned && item.pricePoints > 0);

  const loadItems = () => {
    startTransition(async () => {
      const response = await fetch("/api/shop/items");
      const payload = (await response.json().catch(() => ({}))) as {
        items?: ShopItem[];
        cloudPoints?: number;
        error?: string;
      };

      if (!response.ok) {
        setMessage(payload.error ?? "몽이 아이템을 불러오지 못했습니다.");
        return;
      }

      setItems(payload.items ?? []);
      setCloudPoints(payload.cloudPoints ?? 0);
      setMessage("");
    });
  };

  useEffect(() => {
    loadItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEquip = (itemId: string) => {
    startTransition(async () => {
      const response = await fetch("/api/mongi/equip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        equippedItemId?: string;
        error?: string;
      };

      if (!response.ok || !payload.equippedItemId) {
        setMessage(payload.error ?? "몽이 아이템을 장착하지 못했습니다.");
        return;
      }

      setItems((current) =>
        current.map((item) => ({ ...item, equipped: item.id === payload.equippedItemId }))
      );
      setMessage("몽이 아이템을 장착했습니다.");
      onEquipped?.();
    });
  };

  const handlePurchase = (itemId: string) => {
    startTransition(async () => {
      const response = await fetch("/api/shop/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });
      const payload = (await response.json().catch(() => ({}))) as {
        itemId?: string;
        pointsSpent?: number;
        remainingPoints?: number;
        error?: string;
      };

      if (!response.ok) {
        setMessage(payload.error ?? "구매에 실패했습니다.");
        return;
      }

      setItems((current) =>
        current.map((item) =>
          item.id === payload.itemId ? { ...item, owned: true } : item
        )
      );
      setCloudPoints(payload.remainingPoints ?? 0);
      setMessage(`구매 완료! ${payload.pointsSpent ?? 0} 구름 포인트를 사용했습니다.`);
    });
  };

  return (
    <section
      id="mongi-customize"
      className={`${styles.panel} ${styles.inventoryPanel}`}
    >
      <div className={styles.panelHeader}>
        <div>
          <h2 className={styles.panelTitle}>몽이 꾸미기</h2>
          <p className={styles.panelDescription}>
            보유 아이템을 골라 지금의 몽이에게 어울리는 분위기를 입혀보세요.
          </p>
        </div>
        <div className={styles.cloudPointsBadge}>
          <Cloud size={14} aria-hidden="true" />
          <span>{cloudPoints.toLocaleString()}</span>
        </div>
      </div>

      {ownedItems.length > 0 && (
        <>
          <h3 className={styles.inventorySectionLabel}>보유 아이템</h3>
          <div className={styles.inventoryGrid}>
            {ownedItems.map((item) => (
              <article
                key={item.id}
                className={`${styles.inventoryItem} ${item.equipped ? styles.inventoryItemEquipped : ""}`}
              >
                <div>
                  <span className={styles.inventorySlot}>
                    {slotLabels[item.slot] ?? item.slot}
                  </span>
                  <h3 className={styles.inventoryName}>{item.name}</h3>
                  <p className={styles.inventoryDescription}>{item.description}</p>
                </div>
                <button
                  type="button"
                  className={item.equipped ? styles.secondaryButton : styles.primaryButton}
                  onClick={() => handleEquip(item.id)}
                  disabled={isPending || item.equipped}
                >
                  {item.equipped ? "장착됨" : isPending ? "처리 중" : "장착"}
                </button>
              </article>
            ))}
          </div>
        </>
      )}

      {shopItems.length > 0 && (
        <>
          <h3 className={styles.inventorySectionLabel}>상점</h3>
          <div className={styles.inventoryGrid}>
            {shopItems.map((item) => (
              <article
                key={item.id}
                className={`${styles.inventoryItem} ${item.requiresPro ? styles.inventoryItemProLocked : ""}`}
              >
                <div>
                  <span className={styles.inventorySlot}>
                    {slotLabels[item.slot] ?? item.slot}
                  </span>
                  <h3 className={styles.inventoryName}>
                    {item.requiresPro && <Lock size={12} className={styles.proLockIcon} aria-hidden="true" />}
                    {item.name}
                  </h3>
                  <p className={styles.inventoryDescription}>{item.description}</p>
                  <p className={styles.inventoryPrice}>
                    <Cloud size={12} aria-hidden="true" />
                    {item.pricePoints.toLocaleString()}
                  </p>
                </div>
                {item.requiresPro ? (
                  <span className={styles.proLockedLabel}>Pro 전용</span>
                ) : (
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() => handlePurchase(item.id)}
                    disabled={isPending || cloudPoints < item.pricePoints}
                  >
                    {cloudPoints < item.pricePoints ? "포인트 부족" : isPending ? "처리 중" : "구매"}
                  </button>
                )}
              </article>
            ))}
          </div>
        </>
      )}

      {ownedItems.length === 0 && shopItems.length === 0 && (
        <div className={styles.emptyState}>
          <Sparkles className={styles.inventoryIcon} aria-hidden="true" />
          <p className={styles.emptyTitle}>아이템이 없습니다</p>
          <p className={styles.emptyDescription}>
            일기를 쓰면 구름 포인트를 모아 아이템을 살 수 있어요.
          </p>
        </div>
      )}

      {message && <p className={styles.inventoryMessage}>{message}</p>}
    </section>
  );
}
