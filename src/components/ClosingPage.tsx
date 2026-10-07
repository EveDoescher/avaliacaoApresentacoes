import { A4Page } from './A4Page'

export type ClosingData = {
  melhorApresentacao: string
  aproveitamento: string
  duvida: string
}

type ClosingPageProps = {
  pageNumber: number
  value: ClosingData
  onChange: (
    value: ClosingData,
  ) => void
}

export function ClosingPage({
  pageNumber,
  value,
  onChange,
}: ClosingPageProps) {
  function updateField(
    field: keyof ClosingData,
    newValue: string,
  ) {
    onChange({
      ...value,
      [field]: newValue,
    })
  }

  return (
    <A4Page
      pageNumber={
        pageNumber
      }
    >
      <h1 className="closing-title">
        Fechamento do dia
      </h1>

      <div className="closing-table">
        <div className="closing-row closing-row-1">
          <div className="closing-label">
            <span>
              Qual apresentação mais
              ajudou você a
              <br />
              entender o conteúdo?
              Por quê?
            </span>
          </div>

          <div className="closing-field">
            <textarea
              aria-label="Qual apresentação mais ajudou você"
              value={
                value.melhorApresentacao
              }
              onChange={(
                event,
              ) =>
                updateField(
                  'melhorApresentacao',
                  event.target
                    .value,
                )
              }
            />
          </div>
        </div>

        <div className="closing-row closing-row-2">
          <div className="closing-label">
            <span>
              O que você vai
              aproveitar das
              <br />
              apresentações de hoje
              na sua própria
              <br />
              apresentação ou nos
              seus estudos?
            </span>
          </div>

          <div className="closing-field">
            <textarea
              aria-label="O que você vai aproveitar"
              value={
                value.aproveitamento
              }
              onChange={(
                event,
              ) =>
                updateField(
                  'aproveitamento',
                  event.target
                    .value,
                )
              }
            />
          </div>
        </div>

        <div className="closing-row closing-row-3">
          <div className="closing-label">
            <span>
              Que assunto ainda ficou
              com dúvida e
              <br />
              você gostaria que o
              professor
              <br />
              retomasse?
            </span>
          </div>

          <div className="closing-field">
            <textarea
              aria-label="Que assunto ainda ficou com dúvida"
              value={
                value.duvida
              }
              onChange={(
                event,
              ) =>
                updateField(
                  'duvida',
                  event.target
                    .value,
                )
              }
            />
          </div>
        </div>
      </div>

      <p className="closing-note">
        Se houver mais de três
        apresentações no dia, copie a
        página de uma apresentação e
        cole antes desta.
      </p>
    </A4Page>
  )
}