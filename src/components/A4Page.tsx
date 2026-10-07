import type { ReactNode } from 'react'

type A4PageProps = {
  children: ReactNode
  pageNumber: number
}

export function A4Page({
  children,
  pageNumber,
}: A4PageProps) {
  return (
    <section
      className="a4-page"
      data-pdf-page
    >
      {children}

      <footer className="document-footer">
        Ficha de avaliação das apresentações · aluno · página{' '}
        {pageNumber}
      </footer>
    </section>
  )
}