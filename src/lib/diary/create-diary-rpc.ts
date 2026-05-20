export function isMissingCreateDiaryRpc(error: { message?: string } | null) {
  const message = error?.message ?? "";

  return (
    message.includes("Could not find the function") &&
    message.includes("create_diary_transaction")
  );
}
