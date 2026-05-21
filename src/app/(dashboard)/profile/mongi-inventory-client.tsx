"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import styles from "./styles.module.css";

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  slot: string;
  assetUrl: string | null;
  owned: boolean;
  equipped: boolean;
}

const slotLabels: Record<string, string> = {
  head: "머리",
  neck: "목",
  body: "몸",
};

export default function MongiInventoryClient() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const ownedItems = items.filter((item) => item.owned);

  const loadInventory = () => {
    startTransition(async () => {
      const response = await fetch("/api/mongi/inventory", {
        method: "GET",
      });
      const payload = (await response.json().catch(() => ({}))) as {
        items?: InventoryItem[];
        error?: string;
      };

      if (!response.ok) {
        setMessage(payload.error ?? "몽이 아이템을 불러오지 못했습니다.");
        return;
      }

      setItems(payload.items ?? []);
      setMessage("");
    });
  };

  useEffect(() => {
    loadInventory();
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

      setItems((currentItems) =>
        currentItems.map((item) => ({
          ...item,
          equipped: item.id === payload.equippedItemId,
        }))
      );
      setMessage("몽이 아이템을 장착했습니다.");
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
        <Sparkles className={styles.inventoryIcon} aria-hidden="true" />
      </div>

      <div className={styles.inventoryGrid}>
        {ownedItems.length > 0 ? (
          ownedItems.map((item) => (
            <article
              key={item.id}
              className={`${styles.inventoryItem} ${
                item.equipped ? styles.inventoryItemEquipped : ""
              }`}
            >
              <div>
                <span className={styles.inventorySlot}>
                  {slotLabels[item.slot] ?? item.slot}
                </span>
                <h3 className={styles.inventoryName}>{item.name}</h3>
                <p className={styles.inventoryDescription}>
                  {item.description}
                </p>
              </div>
              <button
                type="button"
                className={item.equipped ? styles.secondaryButton : styles.primaryButton}
                onClick={() => handleEquip(item.id)}
                disabled={isPending || item.equipped}
              >
                {item.equipped ? "장착됨" : isPending ? "장착 중" : "장착"}
              </button>
            </article>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>보유 아이템이 없습니다</p>
            <p className={styles.emptyDescription}>
              일기 보상과 이벤트로 몽이 아이템을 채워갈 예정입니다.
            </p>
          </div>
        )}
      </div>

      {message && <p className={styles.inventoryMessage}>{message}</p>}
    </section>
  );
}
