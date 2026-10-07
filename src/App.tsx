import {
  useEffect,
  useState,
} from 'react'

import {
  StudentInfoPage,
  type StudentInfo,
} from './components/StudentInfoPage'

import {
  PresentationPage,
  type PresentationData,
} from './components/PresentationPage'

import {
  ClosingPage,
  type ClosingData,
} from './components/ClosingPage'

import {
  ExportModal,
  type ExportStatus,
} from './components/ExportModal'

import {
  downloadPdf,
  generatePdf,
} from './utils/exportPdf'

const STORAGE_KEY =
  'ficha-avaliacao-apresentacoes-v1'

type SavedFormData = {
  studentInfo: StudentInfo
  presentations: PresentationData[]
  closing: ClosingData
}

/* =========================================================
   DADOS INICIAIS
   ========================================================= */

function createEmptyPresentation(): PresentationData {
  return {
    tema: '',
    integrantes: '',

    notas: [
      null,
      null,
      null,
      null,
      null,
    ],

    aprendizado: '',
    pontoForte: '',
    melhoria: '',
    pergunta: '',
  }
}

function createDefaultForm(): SavedFormData {
  return {
    studentInfo: {
      disciplina: '',
      nome: '',
      ra: '',
      data: '',
    },

    /*
     * O padrão continua sendo
     * 3 apresentações.
     */
    presentations: [
      createEmptyPresentation(),
      createEmptyPresentation(),
      createEmptyPresentation(),
    ],

    closing: {
      melhorApresentacao: '',
      aproveitamento: '',
      duvida: '',
    },
  }
}

/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function loadSavedForm(): SavedFormData {
  const defaultForm =
    createDefaultForm()

  try {
    const saved =
      localStorage.getItem(
        STORAGE_KEY,
      )

    if (!saved) {
      return defaultForm
    }

    const parsed =
      JSON.parse(
        saved,
      ) as Partial<SavedFormData>

    /*
     * Se por algum motivo o conteúdo salvo
     * estiver incompleto, usamos os valores
     * padrão para o que estiver faltando.
     */
    return {
      studentInfo: {
        ...defaultForm.studentInfo,
        ...(parsed.studentInfo ?? {}),
      },

      presentations:
        Array.isArray(
          parsed.presentations,
        ) &&
        parsed.presentations.length >
          0
          ? parsed.presentations
          : defaultForm.presentations,

      closing: {
        ...defaultForm.closing,
        ...(parsed.closing ?? {}),
      },
    }
  } catch (error) {
    console.error(
      'Não foi possível carregar os dados salvos:',
      error,
    )

    return defaultForm
  }
}

function waitForUiPaint() {
  return new Promise<void>(
    (resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(
          () => {
            resolve()
          },
        )
      })
    },
  )
}

/* =========================================================
   APP
   ========================================================= */

function App() {
  /*
   * Lemos o localStorage somente na
   * inicialização do componente.
   */
  const [initialData] =
    useState<SavedFormData>(
      () => loadSavedForm(),
    )

  const [
    studentInfo,
    setStudentInfo,
  ] =
    useState<StudentInfo>(
      initialData.studentInfo,
    )

  const [
    presentations,
    setPresentations,
  ] =
    useState<PresentationData[]>(
      initialData.presentations,
    )

  const [
    closing,
    setClosing,
  ] =
    useState<ClosingData>(
      initialData.closing,
    )

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false)

  const [
    exportStatus,
    setExportStatus,
  ] =
    useState<ExportStatus>(
      'confirm',
    )

  const [
    exportProgress,
    setExportProgress,
  ] = useState(0)

  const [
    exportedPdf,
    setExportedPdf,
  ] =
    useState<Blob | null>(
      null,
    )

  const [
    exportedFilename,
    setExportedFilename,
  ] = useState(
    'Ficha_Avaliacao_Preenchida.pdf',
  )

  /* =======================================================
     SALVAMENTO AUTOMÁTICO
     ======================================================= */

  useEffect(() => {
    const data: SavedFormData = {
      studentInfo,
      presentations,
      closing,
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data),
      )
    } catch (error) {
      console.error(
        'Não foi possível salvar o formulário:',
        error,
      )
    }
  }, [
    studentInfo,
    presentations,
    closing,
  ])

  /* =======================================================
     APRESENTAÇÕES
     ======================================================= */

  function updatePresentation(
    index: number,
    value: PresentationData,
  ) {
    setPresentations(
      (current) =>
        current.map(
          (
            presentation,
            currentIndex,
          ) =>
            currentIndex === index
              ? value
              : presentation,
        ),
    )
  }

  function addPresentation() {
    setPresentations(
      (current) => [
        ...current,
        createEmptyPresentation(),
      ],
    )
  }

  function removePresentation() {
    setPresentations(
      (current) => {
        /*
         * Nunca menos de uma.
         */
        if (
          current.length <= 1
        ) {
          return current
        }

        return current.slice(
          0,
          -1,
        )
      },
    )
  }

  /* =======================================================
     RESET APÓS EXPORTAÇÃO
     ======================================================= */

  function clearFormAfterExport() {
    const empty =
      createDefaultForm()

    setStudentInfo(
      empty.studentInfo,
    )

    setPresentations(
      empty.presentations,
    )

    setClosing(
      empty.closing,
    )

    /*
     * Remove imediatamente os dados
     * antigos do navegador.
     *
     * O useEffect posteriormente gravará
     * o formulário vazio, o que é exatamente
     * o estado que queremos manter.
     */
    localStorage.removeItem(
      STORAGE_KEY,
    )
  }

  /* =======================================================
     MODAL
     ======================================================= */

  function openExportModal() {
    setExportStatus(
      'confirm',
    )

    setExportProgress(0)

    setModalOpen(true)
  }

  function closeExportModal() {
    if (
      exportStatus ===
      'exporting'
    ) {
      return
    }

    setModalOpen(false)
  }

  /* =======================================================
     NOME DO ARQUIVO
     ======================================================= */

  function buildFilename() {
    const safeName =
      studentInfo.nome
        .trim()
        .replace(
          /[^a-zA-ZÀ-ÿ0-9]+/g,
          '_',
        )
        .replace(
          /^_+|_+$/g,
          '',
        )

    return safeName
      ? `Ficha_Avaliacao_${safeName}.pdf`
      : 'Ficha_Avaliacao_Preenchida.pdf'
  }

  /* =======================================================
     EXPORTAÇÃO
     ======================================================= */

  async function confirmExport() {
    try {
      setExportStatus(
        'exporting',
      )

      setExportProgress(0)

      await waitForUiPaint()

      const blob =
        await generatePdf(
          (
            current,
            total,
          ) => {
            if (
              total <= 0
            ) {
              setExportProgress(
                0,
              )

              return
            }

            const percentage =
              (current /
                total) *
              100

            setExportProgress(
              Math.min(
                100,
                Math.max(
                  0,
                  percentage,
                ),
              ),
            )
          },
        )

      /*
       * Neste ponto o PDF foi gerado
       * com sucesso.
       */

      const filename =
        buildFilename()

      /*
       * Guardamos o Blob ANTES de limpar
       * o formulário.
       *
       * Portanto "clique aqui!" continua
       * funcionando mesmo depois do reset.
       */
      setExportedPdf(blob)

      setExportedFilename(
        filename,
      )

      setExportProgress(100)

      /*
       * Mostra visualmente o 100%.
       */
      await waitForUiPaint()

      /*
       * Inicia o download.
       */
      downloadPdf(
        blob,
        filename,
      )

      /*
       * AGORA podemos limpar os dados.
       *
       * Se generatePdf lançar erro antes
       * disso, nada é apagado.
       */
      clearFormAfterExport()

      /*
       * E mostramos o estado final.
       */
      setExportStatus(
        'success',
      )
    } catch (error) {
      console.error(
        'Erro ao exportar PDF:',
        error,
      )

      /*
       * Importante:
       *
       * Em caso de erro NÃO limpamos
       * absolutamente nada.
       */
      setExportStatus(
        'error',
      )
    }
  }

  function downloadAgain() {
    if (!exportedPdf) {
      return
    }

    downloadPdf(
      exportedPdf,
      exportedFilename,
    )
  }

  /* =======================================================
     INTERFACE
     ======================================================= */

  return (
    <main className="app">
      <div className="app-toolbar">
        <div>
          <h1>
            Ficha de Avaliação
          </h1>

          <p>
            Preencha os campos
            diretamente no documento.
          </p>
        </div>
      </div>

      <div className="document-area">
        <div className="document-pages">

          {/* =========================
              PÁGINA 1
              ========================= */}

          <StudentInfoPage
            value={studentInfo}
            onChange={
              setStudentInfo
            }
          />

          {/* =========================
              APRESENTAÇÕES
              ========================= */}

          {presentations.map(
            (
              presentation,
              index,
            ) => (
              <PresentationPage
                key={index}

                number={
                  index + 1
                }

                pageNumber={
                  index + 2
                }

                value={
                  presentation
                }

                onChange={(
                  value,
                ) =>
                  updatePresentation(
                    index,
                    value,
                  )
                }
              />
            ),
          )}

          {/* =========================
              CONTROLES

              Não possuem data-pdf-page,
              portanto não aparecem no PDF.
              ========================= */}

          <div className="flex items-center justify-center gap-3 py-2">
            <button
              type="button"

              onClick={
                removePresentation
              }

              disabled={
                presentations.length ===
                1
              }

              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-[#c5d3e3]
                bg-white
                px-4
                py-2.5
                text-sm
                font-bold
                text-[#1b2a3a]
                shadow-sm
                transition
                hover:bg-[#f5f7fa]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <span
                aria-hidden="true"
                className="text-lg leading-none"
              >
                −
              </span>

              Remover apresentação
            </button>

            <button
              type="button"

              onClick={
                addPresentation
              }

              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-[#1b2a3a]
                bg-[#1b2a3a]
                px-4
                py-2.5
                text-sm
                font-bold
                text-white
                shadow-sm
                transition
                hover:bg-[#263d54]
              "
            >
              <span
                aria-hidden="true"
                className="text-lg leading-none"
              >
                +
              </span>

              Adicionar apresentação
            </button>
          </div>

          {/* =========================
              FECHAMENTO
              ========================= */}

          <ClosingPage
            pageNumber={
              presentations.length +
              2
            }

            value={closing}

            onChange={
              setClosing
            }
          />
        </div>
      </div>

      {/* =========================
          BOTÃO FLUTUANTE
          ========================= */}

      <button
        type="button"

        className="floating-export-button"

        onClick={
          openExportModal
        }
      >
        <span className="floating-export-icon">
          ↓
        </span>

        Finalizar e exportar
      </button>

      {/* =========================
          MODAL
          ========================= */}

      <ExportModal
        open={modalOpen}

        status={
          exportStatus
        }

        progress={
          exportProgress
        }

        onClose={
          closeExportModal
        }

        onConfirm={
          confirmExport
        }

        onDownloadAgain={
          downloadAgain
        }
      />
    </main>
  )
}

export default App