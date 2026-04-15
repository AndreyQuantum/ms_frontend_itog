import styles from './ui.module.css';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  id?: string;
}

export function Slider({ label, value, min, max, step, onChange, id }: SliderProps) {
  const sliderId = id ?? `slider-${label.replace(/\s/g, '-')}`;
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={styles.slider}>
      <div className={styles.sliderHeader}>
        <label htmlFor={sliderId} className={styles.sliderLabel}>
          {label}
        </label>
        <span className={styles.sliderValue}>{value}</span>
      </div>
      <input
        id={sliderId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={styles.sliderInput}
        style={{ '--slider-fill': `${percentage}%` } as React.CSSProperties}
      />
    </div>
  );
}
