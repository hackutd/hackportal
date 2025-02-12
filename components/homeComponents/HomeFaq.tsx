import Faq from './Faq';
import styles from './HomeFaq.module.css';

export default function HomeFaq(props: { answeredQuestion: AnsweredQuestion[] }) {
  return (
    props.answeredQuestion.length != 0 && (
      <section
        className={styles.container}
        style={{
          background: '#F2F3FF',
          position: 'relative',
        }}
      >
        <Faq fetchedFaqs={props.answeredQuestion}></Faq>
      </section>
    )
  );
}
