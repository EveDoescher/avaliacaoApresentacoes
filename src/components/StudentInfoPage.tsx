import { A4Page } from './A4Page'

export type StudentInfo = {
  disciplina: string
  nome: string
  ra: string
  data: string
}

type StudentInfoPageProps = {
  value: StudentInfo
  onChange: (value: StudentInfo) => void
}

export function StudentInfoPage({
  value,
  onChange,
}: StudentInfoPageProps) {
  function changeField(
    field: keyof StudentInfo,
    newValue: string,
  ) {
    onChange({
      ...value,
      [field]: newValue,
    })
  }

  return (
    <A4Page pageNumber={1}>
      <div className="page-one-eyebrow">
        SEMINÁRIOS · AVALIAÇÃO PELOS COLEGAS
      </div>

      <h1 className="page-one-title">
        Ficha de avaliação das apresentações
      </h1>

      <p className="page-one-subtitle">
        Preencha uma ficha por dia de apresentações e entregue na tarefa
        do Teams.
      </p>

      <div className="student-table">
        <div className="student-table-cell student-table-header">
          <span>Campo</span>
        </div>

        <div className="student-table-cell student-table-header">
          <span>Preencha</span>
        </div>

        <div className="student-table-cell student-table-label">
          <span>Disciplina</span>
        </div>

        <div className="student-table-cell student-table-input-cell">
          <input
            aria-label="Disciplina"
            value={value.disciplina}
            onChange={(event) =>
              changeField(
                'disciplina',
                event.target.value,
              )
            }
          />
        </div>

        <div className="student-table-cell student-table-label">
          <span>Seu nome completo</span>
        </div>

        <div className="student-table-cell student-table-input-cell">
          <input
            aria-label="Seu nome completo"
            value={value.nome}
            onChange={(event) =>
              changeField(
                'nome',
                event.target.value,
              )
            }
          />
        </div>

        <div className="student-table-cell student-table-label">
          <span>RA</span>
        </div>

        <div className="student-table-cell student-table-input-cell">
          <input
            aria-label="RA"
            value={value.ra}
            onChange={(event) =>
              changeField(
                'ra',
                event.target.value,
              )
            }
          />
        </div>

        <div className="student-table-cell student-table-label">
          <span>Data das apresentações</span>
        </div>

        <div className="student-table-cell student-table-input-cell">
          <input
            aria-label="Data das apresentações"
            value={value.data}
            onChange={(event) =>
              changeField(
                'data',
                event.target.value,
              )
            }
          />
        </div>
      </div>

      <h2 className="instructions-title">
        Como preencher
      </h2>

      <div className="instruction instruction-1">
        Avalie <strong>todas</strong> as apresentações do dia,{' '}
        <strong>menos a do seu próprio grupo</strong>.
      </div>

      <div className="instruction instruction-2">
        Dê uma nota de <strong>1 a 5</strong> em cada critério: 1 =
        muito fraco · 2 = fraco · 3 = regular · 4 = bom · 5 =
        excelente.
      </div>

      <div className="instruction instruction-3">
        Escreva comentários{' '}
        <strong>específicos e respeitosos</strong>: diga o que
        funcionou e o que pode melhorar, com um exemplo.
      </div>

      <div className="instruction instruction-4">
        Sua avaliação é vista apenas pelo professor. Ela conta como{' '}
        <strong>participação</strong> e ajuda a compor o retorno dado
        a cada grupo.
      </div>
    </A4Page>
  )
}