import { storage } from "./firebase";
import { ref, uploadString } from "firebase/storage";

export async function testUpload() {
  try {
    const r = ref(storage, "test.txt");
    await uploadString(r, "hello");
    console.log("Storage works");
  } catch (e) {
    console.error("Storage error:", e);
  }
}
