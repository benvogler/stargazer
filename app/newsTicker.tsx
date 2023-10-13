import Logo from './logo';
import styles from './newsTicker.module.css';

const headlines = [
    'Sol Celebrations End as Election Begins',
    'First Captives Freed from Thargoid Titans',
    'Scientists Study Thargoid Barnacle Matrix Sites',
    'Celebrations in Sol for Federal Election',
    'Aegis Produces Sub-Surface Extraction Missiles',
    'Rackham Withdraws from Presidential Election',
    'Aegis Releases Upgraded Xeno Scanner'
];

export default function NewsTicker() {
    let iterations = [1, 2];
    return (
        <div className={styles.tickerWrapper + ' overflow-x-scroll py-3'}>
            <div className="w-max relative flex">
                {
                    iterations.map(key => {
                        return <div key={key} className={styles.ticker + ' flex gap-8'}>
                            {
                                headlines.map(headline => {
                                    return <div key={headline} className="text-sm whitespace-nowrap flex gap-8 items-center">
                                        {headline}
                                        <Logo type="galnet" className="text-sky-600 h-6 w-6"></Logo>
                                    </div>
                                })
                            }
                        </div>
                    })
                }
            </div>
        </div>
    )
}