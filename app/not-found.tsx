import Link from 'next/link';
import css from "./not-found.module.css";

export default function NotFound() {
  return (
    <div>
        <h1 className={css.h1}>404 - Page not found</h1>
            <p>
                Sorry, the page you are looking for does not exist at all.
            </p>
        <Link href="/">Go back home</Link>
    </div>
  );
};