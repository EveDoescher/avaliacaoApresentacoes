type RatingProps = {
  value: number | null
  onChange: (value: number) => void
  ariaLabel: string
}

export function Rating({
  value,
  onChange,
  ariaLabel,
}: RatingProps) {
  return (
    <div
      className="rating"
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {[1, 2, 3, 4, 5].map((number) => {
        const selected = value === number

        return (
          <button
            key={number}
            type="button"
            className="rating-option"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(number)}
          >
            <span className="rating-box">
              {selected && (
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',

                    left: '50%',
                    top: '50%',

                    transform:
                      'translate(-50%, -51%)',

                    margin: 0,
                    padding: 0,

                    color: '#000',

                    fontFamily:
                      'Arial, sans-serif',

                    fontSize: '9pt',
                    fontWeight: 500,
                    lineHeight: 1,

                    pointerEvents: 'none',
                  }}
                >
                  ×
                </span>
              )}
            </span>


            <span className="rating-number">
              {number}
            </span>
          </button>
        )
      })}
    </div>
  )
}