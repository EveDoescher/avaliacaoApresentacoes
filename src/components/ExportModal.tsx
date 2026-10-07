export type ExportStatus =
  | 'confirm'
  | 'exporting'
  | 'success'
  | 'error'

type ExportModalProps = {
  open: boolean
  status: ExportStatus
  progress: number
  onClose: () => void
  onConfirm: () => void
  onDownloadAgain: () => void
}

export function ExportModal({
  open,
  status,
  progress,
  onClose,
  onConfirm,
  onDownloadAgain,
}: ExportModalProps) {
  if (!open) {
    return null
  }

  const canClose =
    status !== 'exporting'

  /*
   * Garante sempre um valor entre 0 e 100.
   */
  const normalizedProgress =
    Math.min(
      100,
      Math.max(0, progress),
    )

  /*
   * 0%   -> scaleX(0)
   * 20%  -> scaleX(0.2)
   * 50%  -> scaleX(0.5)
   * 100% -> scaleX(1)
   */
  const progressScale =
    normalizedProgress / 100

  return (
    <div
      className="export-modal-backdrop"
      role="presentation"
      onMouseDown={() => {
        if (canClose) {
          onClose()
        }
      }}
    >
      <div
        className="export-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {status === 'confirm' && (
          <>
            <div className="export-modal-icon">
              <PdfIcon />
            </div>

            <h2
              id="export-modal-title"
              className="export-modal-title"
            >
              Finalizar documento?
            </h2>

            <p className="export-modal-description">
              Confirme para gerar e exportar
              a ficha preenchida em PDF.
            </p>

            <div className="export-modal-actions">
              <button
                type="button"
                className="modal-button modal-button-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="modal-button modal-button-primary"
                onClick={onConfirm}
              >
                Sim, exportar
              </button>
            </div>
          </>
        )}

        {status === 'exporting' && (
          <>
            <h2
              id="export-modal-title"
              className="export-modal-title"
            >
              Gerando documento
            </h2>

            <p className="export-modal-description">
              Preparando seu PDF...
            </p>

            <div
              className="export-progress"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={
                Math.round(
                  normalizedProgress,
                )
              }
            >
              <div
                className="export-progress-bar"
                style={{
                  /*
                   * A barra SEMPRE possui
                   * 100% da largura física.
                   *
                   * O progresso é representado
                   * somente pelo scaleX.
                   */
                  width: '100%',

                  transformOrigin:
                    'left center',

                  transform:
                    `scaleX(${progressScale})`,

                  /*
                   * Sobrescreve a antiga
                   * transition de width.
                   *
                   * Queremos que a posição
                   * represente exatamente
                   * o número exibido.
                   */
                  transition: 'none',
                }}
              />
            </div>

            <span className="export-progress-label">
              {Math.round(
                normalizedProgress,
              )}
              %
            </span>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="export-success-icon">
              <PdfIcon />
            </div>

            <h2
              id="export-modal-title"
              className="export-modal-title"
            >
              Documento Exportado
            </h2>

            <p className="export-download-help">
              Caso o download não seja
              iniciado automaticamente{' '}
              <button
                type="button"
                className="download-again"
                onClick={
                  onDownloadAgain
                }
              >
                clique aqui!
              </button>
            </p>

            <button
              type="button"
              className="modal-button modal-button-primary success-close-button"
              onClick={onClose}
            >
              Concluir
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="export-modal-error-symbol">
              !
            </div>

            <h2
              id="export-modal-title"
              className="export-modal-title"
            >
              Não foi possível exportar
            </h2>

            <p className="export-modal-description">
              Ocorreu um problema durante
              a geração do PDF.
            </p>

            <button
              type="button"
              className="modal-button modal-button-primary"
              onClick={onClose}
            >
              Fechar
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function PdfIcon() {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <path
        d="M15 5h24l10 10v44H15z"
        className="pdf-icon-page"
      />

      <path
        d="M39 5v11h10"
        className="pdf-icon-fold"
      />

      <rect
        x="21"
        y="35"
        width="22"
        height="11"
        rx="2"
        className="pdf-icon-label"
      />

      <text
        x="32"
        y="43"
        textAnchor="middle"
        className="pdf-icon-text"
      >
        PDF
      </text>
    </svg>
  )
}