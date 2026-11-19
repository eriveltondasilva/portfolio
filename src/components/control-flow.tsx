// import { Fragment } from 'react';

// import type { Key, ReactNode } from 'react';

// type ShowProps<T> = {
//   when: T | null | undefined | false;
//   fallback?: ReactNode;
//   children: ReactNode | ((value: NonNullable<T>) => ReactNode);
// };

// export function Show<T>({ when, fallback = null, children }: ShowProps<T>) {
//   if (!when) return fallback;

//   return typeof children === 'function' ? children(when) : children;
// }

// // ─────────────────────────────────────

// type ForProps<T> = {
//   each: readonly T[] | null | undefined;
//   getKey: (item: T) => Key;
//   fallback?: ReactNode;
//   children: (item: T, index: number) => ReactNode;
// };

// export function For<T>({
//   each,
//   getKey,
//   fallback = null,
//   children,
// }: ForProps<T>) {
//   if (!each?.length) return fallback;

//   return (
//     <>
//       {each.map((item, index) => (
//         <Fragment key={getKey(item)}>{children(item, index)}</Fragment>
//       ))}
//     </>
//   );
// }
