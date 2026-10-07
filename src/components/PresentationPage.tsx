import { A4Page } from './A4Page'
import { Rating } from './Rating'

export type PresentationData = {
  tema: string
  integrantes: string

  notas: [
    number | null,
    number | null,
    number | null,
    number | null,
    number | null,
  ]

  aprendizado: string
  pontoForte: string
  melhoria: string
  pergunta: string
}

type PresentationPageProps = {
  number: number
  pageNumber: number
  value: PresentationData
  onChange: (value: PresentationData) => void
}

const criteria = [
  {
    title: '1. Parte conceitual',
    description:
      'O grupo explicou o assunto de forma correta e mostrou que domina o tema?',
  },
  {
    title: '2. Aplicação / exemplo',
    description:
      'A demonstração, o exemplo ou o cálculo funcionou e ajudou a entender?',
  },
  {
    title: '3. Como deveria ser feito',
    description:
      'Ficaram claros o passo a passo, as boas práticas e os erros a evitar?',
  },
  {
    title: '4. Clareza e organização',
    description:
      'Slides legíveis, fala clara, sequência lógica e tempo respeitado?',
  },
  {
    title: '5. Participação e dúvidas',
    description:
      'Todos participaram e as perguntas foram bem respondidas?',
  },
]

export function PresentationPage({
  number,
  pageNumber,
  value,
  onChange,
}: PresentationPageProps) {
  function updateField(
    field: keyof Omit<PresentationData, 'notas'>,
    newValue: string,
  ) {
    onChange({
      ...value,
      [field]: newValue,
    })
  }

  function updateRating(
    index: number,
    rating: number,
  ) {
    const notas = [
      ...value.notas,
    ] as PresentationData['notas']

    notas[index] = rating

    onChange({
      ...value,
      notas,
    })
  }

  return (
    <A4Page pageNumber={pageNumber}>
      <h1 className="presentation-title">
        Apresentação {number}
      </h1>

      <div className="presentation-info-table">
        <div className="presentation-info-header">
          <span>Campo</span>
        </div>

        <div className="presentation-info-header">
          <span>Preencha</span>
        </div>

        <div className="presentation-info-label">
          <span>Tema</span>
        </div>

        <div className="presentation-info-input">
          <input
            aria-label={`Tema da apresentação ${number}`}
            value={value.tema}
            onChange={(event) =>
              updateField(
                'tema',
                event.target.value,
              )
            }
          />
        </div>

        <div className="presentation-info-label">
          <span>Integrantes do grupo</span>
        </div>

        <div className="presentation-info-input">
          <input
            aria-label={`Integrantes da apresentação ${number}`}
            value={value.integrantes}
            onChange={(event) =>
              updateField(
                'integrantes',
                event.target.value,
              )
            }
          />
        </div>
      </div>

      <div className="criteria-table">
        <div className="criteria-header">
          <span>Critério</span>
        </div>

        <div className="criteria-header">
          <span>O que observar</span>
        </div>

        <div className="criteria-header">
          <span>Nota (marque uma)</span>
        </div>

        {criteria.map((criterion, index) => (
          <div
            className="criteria-row"
            key={criterion.title}
          >
            <div className="criteria-title">
              <span>{criterion.title}</span>
            </div>

            <div className="criteria-description">
              <span>{criterion.description}</span>
            </div>

            <div className="criteria-rating">
              <Rating
                value={value.notas[index]}
                onChange={(rating) =>
                  updateRating(index, rating)
                }
                ariaLabel={`Nota de ${criterion.title}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="comments-table">
        <div className="comment-row comment-row-learning">
          <div className="comment-label">
            <span>
              O que eu aprendi com esta
              <br />
              apresentação
            </span>
          </div>

          <div className="comment-field">
            <textarea
              aria-label="O que eu aprendi com esta apresentação"
              value={value.aprendizado}
              onChange={(event) =>
                updateField(
                  'aprendizado',
                  event.target.value,
                )
              }
            />
          </div>
        </div>

        <div className="comment-row">
          <div className="comment-label">
            <span>Ponto forte do grupo</span>
          </div>

          <div className="comment-field">
            <textarea
              aria-label="Ponto forte do grupo"
              value={value.pontoForte}
              onChange={(event) =>
                updateField(
                  'pontoForte',
                  event.target.value,
                )
              }
            />
          </div>
        </div>

        <div className="comment-row">
          <div className="comment-label">
            <span>Uma sugestão de melhoria</span>
          </div>

          <div className="comment-field">
            <textarea
              aria-label="Uma sugestão de melhoria"
              value={value.melhoria}
              onChange={(event) =>
                updateField(
                  'melhoria',
                  event.target.value,
                )
              }
            />
          </div>
        </div>

        <div className="comment-row comment-row-question">
          <div className="comment-label">
            <span>
              Uma pergunta que eu faria ao
              <br />
              grupo
            </span>
          </div>

          <div className="comment-field">
            <textarea
              aria-label="Uma pergunta que eu faria ao grupo"
              value={value.pergunta}
              onChange={(event) =>
                updateField(
                  'pergunta',
                  event.target.value,
                )
              }
            />
          </div>
        </div>
      </div>
    </A4Page>
  )
}