import { MessageSquare } from "lucide-react";
import styles from "./styles.module.css";

export default function ChatBot() {
  return (
    <button className={styles.chatBotButton}>
      <MessageSquare className={styles.chatBotIcon} />
    </button>
  );
}
