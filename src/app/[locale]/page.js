"use client";

import styles from "./page.module.css";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function Home({ params: { locale } }) {
  const router = useRouter();

  const pathname = usePathname();

  return (
    <main className={styles.main}>
      <Link href={`/blog`}>Blog</Link>
      <select
        id="location"
        name="location"
        className="block ml-2 rounded-md border-0 outline-none bg-transparent text-white/60 focus:ring-0 group-[.is-sticky]:text-gray-800 dark:group-[.is-sticky]:text-white/60"
        defaultValue={pathname}
        onChange={(e) => {
          router.push(e.target.value);
        }}
      >
        <option value="/en">En</option>
        <option value="/ar">Ar</option>
      </select>
    </main>
  );
}
