import { toPng } from 'html-to-image'
import { jsPDF } from 'jspdf'

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297

export type ExportProgressCallback = (
  current: number,
  total: number,
) => void

/*
 * Dá ao navegador tempo para atualizar visualmente
 * a barra de progresso antes de começar a próxima
 * página.
 */
function waitForPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resolve()
      })
    })
  })
}

export async function generatePdf(
  onProgress?: ExportProgressCallback,
): Promise<Blob> {
  await document.fonts.ready

  const activeElement =
    document.activeElement

  if (
    activeElement instanceof HTMLElement
  ) {
    activeElement.blur()
  }

  const pages = Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-pdf-page]',
    ),
  )

  if (pages.length === 0) {
    throw new Error(
      'Nenhuma página encontrada para exportação.',
    )
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  })

  /*
   * Começa explicitamente em 0%.
   */
  onProgress?.(
    0,
    pages.length,
  )

  await waitForPaint()

  for (
    let index = 0;
    index < pages.length;
    index++
  ) {
    const page = pages[index]

    page
      .querySelectorAll<HTMLTextAreaElement>(
        'textarea',
      )
      .forEach((textarea) => {
        textarea.scrollTop = 0
        textarea.scrollLeft = 0
      })

    page
      .querySelectorAll<HTMLInputElement>(
        'input',
      )
      .forEach((input) => {
        input.scrollLeft = 0
      })

    const dataUrl =
      await toPng(
        page,
        {
          pixelRatio: 2,
          backgroundColor:
            '#ffffff',

          cacheBust: true,

          style: {
            boxShadow: 'none',
          },
        },
      )

    if (index > 0) {
      pdf.addPage(
        'a4',
        'portrait',
      )
    }

    pdf.addImage(
      dataUrl,
      'PNG',
      0,
      0,
      A4_WIDTH_MM,
      A4_HEIGHT_MM,
      undefined,
      'FAST',
    )

    /*
     * Só avançamos o progresso quando
     * a página realmente terminou.
     *
     * 5 páginas:
     * página 1 -> 20%
     * página 2 -> 40%
     * página 3 -> 60%
     * página 4 -> 80%
     * página 5 -> 100%
     *
     * Se houver mais apresentações,
     * isso se adapta automaticamente.
     */
    onProgress?.(
      index + 1,
      pages.length,
    )

    /*
     * Permite que a interface desenhe
     * o novo tamanho da barra.
     */
    await waitForPaint()
  }

  return pdf.output('blob')
}

export function downloadPdf(
  blob: Blob,
  filename: string,
) {
  const url =
    URL.createObjectURL(blob)

  const link =
    document.createElement('a')

  link.href = url
  link.download = filename

  document.body.appendChild(
    link,
  )

  link.click()
  link.remove()

  window.setTimeout(
    () => {
      URL.revokeObjectURL(
        url,
      )
    },
    1000,
  )
}