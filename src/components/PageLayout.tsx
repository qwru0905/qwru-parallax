import { ReactNode } from 'react'
import styles from './PageLayout.module.css'

interface Props {
  children: ReactNode
}

export default function PageLayout({ children }: Props) {
  return <main className={styles.layout}>{children}</main>
}
