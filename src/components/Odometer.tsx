const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function Wheel({ digit }: { digit: number }) {
  return (
    <span className="inline-block h-[1em] w-[0.5em] overflow-hidden align-top">
      <span
        className="flex flex-col transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.9,0.25,1.15)]"
        style={{ transform: `translateY(-${digit}em)` }}
      >
        {DIGITS.map((d) => (
          <span key={d} className="h-[1em] text-center leading-none">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function Odometer({
  value,
  digits = 2,
}: {
  value: number;
  digits?: number;
}) {
  const text = String(value).padStart(digits, "0");
  return (
    <span aria-label={String(value)} role="text">
      {[...text].map((d, i) => (
        <Wheel key={i} digit={Number(d)} />
      ))}
    </span>
  );
}
