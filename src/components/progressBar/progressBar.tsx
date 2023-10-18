import styles from './progressBar.module.css';

export default function ProgressBar({ progress, className='w-8 h-8', width=20 }: { progress: number, className?: string, width?: number }) {
    return (
        <div className={className}>
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                    className="text-sky-700 opacity-30 stroke-current"
                    strokeWidth={width}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                ></circle>
                <circle
                    className={`${styles.ring} text-sky-700  stroke-current`}
                    strokeWidth={width}
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDashoffset={`calc(400 - (400 * (${progress} * 62.8319)) / 100)`}
                ></circle>
            </svg>
        </div>
    )
}